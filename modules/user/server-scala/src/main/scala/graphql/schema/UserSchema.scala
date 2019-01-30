package graphql.schema

import common.implicits.RichDBIO._
import common.implicits.RichTry._
import common.graphql.UserContext
import common.{InputUnmarshallerGenerator, Logger}
import config.AuthConfig
import graphql.resolvers.UserResolver
import javax.inject.Inject
import jwt.model.Tokens
import model._
import model.auth.facebook.AuthFacebookInput
import model.auth.github.AuthGitHubInput
import model.auth.google.AuthGoogleInput
import model.auth.linkedin.AuthLinkedInInput
import model.auth.{AuthInput, AuthPayload, UserAuth}
import model.facebook.FacebookAuth
import model.github.GithubAuth
import model.google.GoogleAuth
import model.linkedin.LinkedinAuth
import repositories._
import repositories.auth._
import sangria.schema.{
  Argument, Field, InputObjectType, IntType, ListType, ObjectType, OptionInputType, OptionType, StringType
}
import sangria.macros.derive._
import sangria.marshalling.FromInput
import services.{UserAccessService, UserAuthService}

import scala.concurrent.ExecutionContext

class UserSchema @Inject()(
    authConfig: AuthConfig,
    userResolver: UserResolver,
    userProfileRepository: UserProfileRepository,
    facebookAuthRepo: FacebookAuthRepository,
    googleAuthRepository: GoogleAuthRepository,
    githubAuthRepository: GithubAuthRepository,
    linkedinAuthRepository: LinkedinAuthRepository,
    certificateAuthRepository: CertificateAuthRepository,
    userAuthService: UserAuthService,
    userAccessService: UserAccessService
)(implicit executionContext: ExecutionContext)
  extends InputUnmarshallerGenerator
  with Logger {

  implicit val userProfile: ObjectType[UserContext, UserProfile] = deriveObjectType(ObjectTypeName("UserProfile"))

  implicit val user: ObjectType[UserContext, User] = deriveObjectType(
    ObjectTypeName("User"),
    ExcludeFields("password"),
    AddFields(
      Field("profile", OptionType(userProfile), resolve = {
        sangriaContext =>
          sangriaContext.value.userProfile(userProfileRepository)
      }),
      Field(
        "auth",
        OptionType(userAuth),
        resolve = {
          sangriaContext =>
            for {
              certificate <- certificateAuthRepository.findOne(sangriaContext.value.id.get).run
              fbAuth <- facebookAuthRepo.findOne(sangriaContext.value.id.get).run
              gAuth <- googleAuthRepository.findOne(sangriaContext.value.id.get).run
              ghAuth <- githubAuthRepository.findOne(sangriaContext.value.id.get).run
              lnAuth <- linkedinAuthRepository.findOne(sangriaContext.value.id.get).run
            } yield
              (certificate, fbAuth, gAuth, ghAuth, lnAuth) match {
                case (None, None, None, None, None) => None
                case _ => Some(UserAuth(certificate, fbAuth, gAuth, ghAuth, lnAuth))
              }
        }
      )
    )
  )

  val userPayload: ObjectType[UserContext, UserPayload] = deriveObjectType(ObjectTypeName("UserPayload"))

  implicit val profileInput: InputObjectType[ProfileInput] = deriveInputObjectType(InputObjectTypeName("ProfileInput"))
  implicit val addUserInput: InputObjectType[AddUserInput] = deriveInputObjectType(InputObjectTypeName("AddUserInput"))

  implicit val addUserInputUnmarshaller: FromInput[AddUserInput] = inputUnmarshaller {
    input =>
      AddUserInput(
        username = input("username").asInstanceOf[String],
        email = input("email").asInstanceOf[String],
        role = input("role").asInstanceOf[String],
        password = input("password").asInstanceOf[String],
        isActive = input.get("isActive").flatMap(_.asInstanceOf[Option[Boolean]]),
        profile = input.get("profile").flatMap(_.asInstanceOf[Option[ProfileInput]]),
        auth = input.get("auth").flatMap(_.asInstanceOf[Option[AuthInput]])
      )
  }

  implicit val editUserInput: InputObjectType[EditUserInput] = deriveInputObjectType(
    InputObjectTypeName("EditUserInput")
  )

  implicit val editUserInputUnmarshaller: FromInput[EditUserInput] = inputUnmarshaller {
    input =>
      EditUserInput(
        id = input("id").asInstanceOf[Int],
        username = input("username").asInstanceOf[String],
        role = input("role").asInstanceOf[String],
        isActive = input.get("isActive").flatMap(_.asInstanceOf[Option[Boolean]]),
        email = input("email").asInstanceOf[String],
        password = input.get("password").flatMap(_.asInstanceOf[Option[String]]),
        profile = input.get("profile").flatMap(_.asInstanceOf[Option[ProfileInput]]),
        auth = input.get("auth").flatMap(_.asInstanceOf[Option[AuthInput]])
      )
  }

  implicit val orderByUserInput: InputObjectType[OrderByUserInput] = deriveInputObjectType(
    InputObjectTypeName("OrderByUserInput")
  )

  implicit val orderByUserInputUnmarshaller: FromInput[OrderByUserInput] = inputUnmarshaller {
    input =>
      OrderByUserInput(
        column = input.get("column").flatMap(_.asInstanceOf[Option[String]]),
        order = input.get("order").flatMap(_.asInstanceOf[Option[String]])
      )
  }

  implicit val filterUserInput: InputObjectType[FilterUserInput] = deriveInputObjectType(
    InputObjectTypeName("FilterUserInput")
  )

  implicit val filterUserInputUnmarshaller: FromInput[FilterUserInput] = inputUnmarshaller {
    input =>
      FilterUserInput(
        searchText = input.get("searchText").flatMap(_.asInstanceOf[Option[String]]),
        role = input.get("role").flatMap(_.asInstanceOf[Option[String]]),
        isActive = input.get("isActive").flatMap(_.asInstanceOf[Option[Boolean]])
      )
  }

  val registerUserInput: InputObjectType[RegisterUserInput] = deriveInputObjectType(
    InputObjectTypeName("RegisterUserInput")
  )
  val confirmRegistrationInput: InputObjectType[ConfirmRegistrationInput] = deriveInputObjectType(
    InputObjectTypeName("ConfirmRegistrationInput")
  )
  val resendConfirmationMessageInput: InputObjectType[ResendConfirmationMessageInput] = deriveInputObjectType(
    InputObjectTypeName("ResendConfirmationMessageInput")
  )

  implicit val certificateAuth: ObjectType[UserContext, CertificateAuth] = deriveObjectType(
    ObjectTypeName("CertificateAuth")
  )

  implicit val facebookAuth: ObjectType[UserContext, FacebookAuth] =
    deriveObjectType(ObjectTypeName("FacebookAuth"), ExcludeFields("userId"), RenameField("id", "fbId"))

  implicit val googleAuth: ObjectType[UserContext, GoogleAuth] =
    deriveObjectType(ObjectTypeName("GoogleAuth"), ExcludeFields("userId"), RenameField("id", "googleId"))

  implicit val githubAuth: ObjectType[UserContext, GithubAuth] =
    deriveObjectType(ObjectTypeName("GithubAuth"), ExcludeFields("userId"), RenameField("id", "ghId"))

  implicit val linkedinAuth: ObjectType[UserContext, LinkedinAuth] =
    deriveObjectType(ObjectTypeName("LinkedInAuth"), ExcludeFields("userId"), RenameField("id", "lnId"))

  implicit val userAuth: ObjectType[UserContext, UserAuth] = deriveObjectType(ObjectTypeName("UserAuth"))
  val loginUserInput: InputObjectType[LoginUserInput] = deriveInputObjectType(InputObjectTypeName("LoginUserInput"))
  val authPayload: ObjectType[UserContext, AuthPayload] = deriveObjectType(ObjectTypeName("AuthPayload"))
  implicit val tokens: ObjectType[UserContext, Tokens] = deriveObjectType(ObjectTypeName("Tokens"))

  val forgotPasswordInput: InputObjectType[ForgotPasswordInput] = deriveInputObjectType(
    InputObjectTypeName("ForgotPasswordInput")
  )
  val resetPasswordInput: InputObjectType[ResetPasswordInput] = deriveInputObjectType(
    InputObjectTypeName("ResetPasswordInput")
  )
  val resetPayload: ObjectType[UserContext, ResetPayload] = deriveObjectType(ObjectTypeName("ResetPayload"))

  implicit val registerUserInputUnmarshaller: FromInput[RegisterUserInput] = inputUnmarshaller {
    input =>
      RegisterUserInput(
        username = input("username").asInstanceOf[String],
        email = input("email").asInstanceOf[String],
        password = input("password").asInstanceOf[String]
      )
  }

  implicit val confirmRegistrationInputUnmarshaller: FromInput[ConfirmRegistrationInput] = inputUnmarshaller {
    input =>
      ConfirmRegistrationInput(
        token = input("token").asInstanceOf[String]
      )
  }

  implicit val resendConfirmationMessageInputUnmarshaller: FromInput[ResendConfirmationMessageInput] =
    inputUnmarshaller {
      input =>
        ResendConfirmationMessageInput(
          usernameOrEmail = input("usernameOrEmail").asInstanceOf[String],
          password = input("password").asInstanceOf[String]
        )
    }

  implicit val loginUserInputUnmarshaller: FromInput[LoginUserInput] = inputUnmarshaller {
    input =>
      LoginUserInput(
        usernameOrEmail = input("usernameOrEmail").asInstanceOf[String],
        password = input("password").asInstanceOf[String]
      )
  }

  implicit val forgotPasswordInputUnmarshaller: FromInput[ForgotPasswordInput] = inputUnmarshaller {
    input =>
      ForgotPasswordInput(
        email = input("email").asInstanceOf[String]
      )
  }

  implicit val resetPasswordInputUnmarshaller: FromInput[ResetPasswordInput] = inputUnmarshaller {
    input =>
      ResetPasswordInput(
        token = input("token").asInstanceOf[String],
        password = input("password").asInstanceOf[String],
        passwordConfirmation = input("passwordConfirmation").asInstanceOf[String]
      )
  }

  implicit val authInput: InputObjectType[AuthInput] = deriveInputObjectType(InputObjectTypeName("AuthInput"))

  implicit val authCertificateInput: InputObjectType[AuthCertificateInput] = deriveInputObjectType(
    InputObjectTypeName("AuthCertificateInput")
  )
  implicit val authFacebookInput: InputObjectType[AuthFacebookInput] = deriveInputObjectType(
    InputObjectTypeName("AuthFacebookInput")
  )
  implicit val authGoogleInput: InputObjectType[AuthGoogleInput] = deriveInputObjectType(
    InputObjectTypeName("AuthGoogleInput")
  )
  implicit val authGitHubInput: InputObjectType[AuthGitHubInput] = deriveInputObjectType(
    InputObjectTypeName("AuthGitHubInput")
  )
  implicit val authLinkedInInput: InputObjectType[AuthLinkedInInput] = deriveInputObjectType(
    InputObjectTypeName("AuthLinkedInInput")
  )

  def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "currentUser",
      fieldType = OptionType(user),
      arguments = List.empty,
      resolve =
        sc => userAuthService.identify(sc.ctx.requestHeaders).asFuture.flatMap(id => userResolver.user(id).map(_.user))
    ),
    Field(
      name = "user",
      fieldType = userPayload,
      arguments = List(Argument("id", IntType)),
      resolve = sc =>
        userAccessService.withAdminFilter(
          headers = sc.ctx.requestHeaders,
          operation = userResolver.user(sc.arg[Int]("id"))
      )
    ),
    Field(
      name = "users",
      fieldType = ListType(user),
      arguments = List(
        Argument("orderBy", OptionInputType(orderByUserInput)),
        Argument("filter", OptionInputType(filterUserInput))
      ),
      resolve = sc =>
        userAccessService.withAdminFilter(
          headers = sc.ctx.requestHeaders,
          operation = userResolver.users(sc.argOpt[OrderByUserInput]("sc"), sc.argOpt[FilterUserInput]("filter"))
      )
    )
  )

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "addUser",
      fieldType = userPayload,
      arguments = List(Argument("input", addUserInput)),
      resolve = sc =>
        userAccessService.withAdminFilter(
          headers = sc.ctx.requestHeaders,
          operation = userResolver.addUser(sc.arg("input"))
      )
    ),
    Field(
      name = "editUser",
      fieldType = userPayload,
      arguments = List(Argument("input", editUserInput)),
      resolve = sc =>
        userAccessService.withAdminFilter(
          headers = sc.ctx.requestHeaders,
          operation = userResolver.editUser(sc.arg("input"))
      )
    ),
    Field(
      name = "deleteUser",
      fieldType = userPayload,
      arguments = List(Argument("id", IntType)),
      resolve = sc =>
        userAccessService.withAdminFilter(
          headers = sc.ctx.requestHeaders,
          operation = userResolver.deleteUser(sc.arg("id"))
      )
    ),
    Field(
      name = "register",
      fieldType = userPayload,
      arguments = List(Argument("input", registerUserInput)),
      resolve = sc => userResolver.register(sc.args.arg[RegisterUserInput]("input"), authConfig.skipConfirmation)
    ),
    Field(
      name = "resendConfirmationMessage",
      fieldType = userPayload,
      arguments = List(Argument("input", resendConfirmationMessageInput)),
      resolve = sc => userResolver.resendConfirmationMesage(sc.args.arg[ResendConfirmationMessageInput]("input"))
    ),
    Field(
      name = "login",
      fieldType = authPayload,
      arguments = List(Argument("input", loginUserInput)),
      resolve = sc => userResolver.login(sc.args.arg[LoginUserInput]("input"))
    ),
    Field(
      name = "forgotPassword",
      fieldType = StringType,
      arguments = List(Argument("input", forgotPasswordInput)),
      resolve = sc => userResolver.forgotPassword(sc.args.arg[ForgotPasswordInput]("input"))
    ),
    Field(
      name = "resetPassword",
      fieldType = resetPayload,
      arguments = List(Argument("input", resetPasswordInput)),
      resolve = sc => userResolver.resetPassword(sc.args.arg[ResetPasswordInput]("input"))
    )
  )
}
