package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.graphql.DispatcherResolver._
import common.graphql.UserContext
import common.{InputUnmarshallerGenerator, Logger}
import config.AuthConfig
import graphql.resolvers.UserResolver
import javax.inject.Inject
import model.oauth.{CertificateAuth, UserAuth}
import model.oauth.facebook.FacebookAuth
import model.oauth.github.GithubAuth
import model.oauth.google.GoogleAuth
import model.oauth.linkedin.LinkedinAuth
import model.{UserPayload, _}
import modules.jwt.model.Tokens
import repositories.auth.{FacebookAuthRepository, GithubAuthRepository, GoogleAuthRepository, LinkedinAuthRepository}
import repositories.UserProfileRepository
import sangria.schema.OptionType
import sangria.macros.derive._
import sangria.marshalling.FromInput
import sangria.schema.{Argument, Field, InputObjectType, ObjectType, StringType}

import scala.concurrent.ExecutionContext

class UserSchema @Inject()(authConfig: AuthConfig,
                           userProfileRepository: UserProfileRepository,
                           facebookAuthRepo: FacebookAuthRepository,
                           googleAuthRepository: GoogleAuthRepository,
                           githubAuthRepository: GithubAuthRepository,
                           linkedinAuthRepository: LinkedinAuthRepository)
                          (implicit val materializer: ActorMaterializer,
                           actorSystem: ActorSystem,
                           executionContext: ExecutionContext) extends InputUnmarshallerGenerator
  with Logger {

  implicit val registerUserInput: InputObjectType[RegisterUserInput] = deriveInputObjectType(InputObjectTypeName("RegisterUserInput"))
  implicit val confirmRegistrationInput: InputObjectType[ConfirmRegistrationInput] = deriveInputObjectType(InputObjectTypeName("ConfirmRegistrationInput"))
  implicit val resendConfirmationMessageInput: InputObjectType[ResendConfirmationMessageInput] = deriveInputObjectType(InputObjectTypeName("ResendConfirmationMessageInput"))

  implicit val userProfile: ObjectType[UserContext, UserProfile] = deriveObjectType(ObjectTypeName("UserProfile"))

  implicit val certificateAuth: ObjectType[UserContext, CertificateAuth] = deriveObjectType(ObjectTypeName("CertificateAuth"))

  implicit val facebookAuth: ObjectType[UserContext, FacebookAuth] = deriveObjectType(
    ObjectTypeName("FacebookAuth"), ExcludeFields("userId"), RenameField("id", "fbId"))

  implicit val googleAuth: ObjectType[UserContext, GoogleAuth] = deriveObjectType(
    ObjectTypeName("GoogleAuth"), ExcludeFields("userId"), RenameField("id", "googleId"))

  implicit val githubAuth: ObjectType[UserContext, GithubAuth] = deriveObjectType(
    ObjectTypeName("GithubAuth"), ExcludeFields("userId"), RenameField("id", "ghId"))

  implicit val linkedinAuth: ObjectType[UserContext, LinkedinAuth] = deriveObjectType(
    ObjectTypeName("LinkedInAuth"), ExcludeFields("userId"), RenameField("id", "lnId"))

  implicit val userAuth: ObjectType[UserContext, UserAuth] = deriveObjectType(ObjectTypeName("UserAuth"))

  implicit val user: ObjectType[UserContext, User] = deriveObjectType(
    ObjectTypeName("User"),
    ExcludeFields("password"),
    AddFields(
      Field("profile", OptionType(userProfile), resolve = {
        sangriaContext =>
          sangriaContext.value.userProfile(userProfileRepository)
      }),
      Field("auth", OptionType(userAuth), resolve = {
        sangriaContext =>
          sangriaContext.value.userAuth(None, facebookAuthRepo, googleAuthRepository, githubAuthRepository, linkedinAuthRepository)
      })
    )
  )

  implicit val userPayload: ObjectType[UserContext, UserPayload] = deriveObjectType(ObjectTypeName("UserPayload"))
  implicit val loginUserInput: InputObjectType[LoginUserInput] = deriveInputObjectType(InputObjectTypeName("LoginUserInput"))
  implicit val authPayload: ObjectType[UserContext, AuthPayload] = deriveObjectType(ObjectTypeName("AuthPayload"))
  implicit val tokens: ObjectType[UserContext, Tokens] = deriveObjectType(ObjectTypeName("Tokens"))
  implicit val forgotPasswordInput: InputObjectType[ForgotPasswordInput] = deriveInputObjectType(InputObjectTypeName("ForgotPasswordInput"))
  implicit val resetPasswordInput: InputObjectType[ResetPasswordInput] = deriveInputObjectType(InputObjectTypeName("ResetPasswordInput"))
  implicit val resetPayload: ObjectType[UserContext, ResetPayload] = deriveObjectType(ObjectTypeName("ResetPayload"))

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

  implicit val resendConfirmationMessageInputUnmarshaller: FromInput[ResendConfirmationMessageInput] = inputUnmarshaller {
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
        usernameOrEmail = input("usernameOrEmail").asInstanceOf[String]
      )
  }

  implicit val resetPasswordInputUnmarshaller: FromInput[ResetPasswordInput] = inputUnmarshaller {
    input =>
      ResetPasswordInput(
        token = input("token").asInstanceOf[String],
        password = input("password").asInstanceOf[String]
      )
  }

  def queries: List[Field[UserContext, Unit]] = List(
    //TODO implement stub's functionality
    Field(
      name = "currentUser",
      fieldType = OptionType(user),
      arguments = List.empty,
      resolve = sc => None
    )
  )

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "register",
      fieldType = userPayload,
      arguments = List(Argument("input", registerUserInput)),
      resolve = sc => resolveWithDispatcher[UserPayload](
        input = (sc.args.arg[RegisterUserInput]("input"), authConfig.skipConfirmation),
        userContext = sc.ctx,
        namedResolverActor = UserResolver
      )
    ),
    Field(
      name = "confirmRegistration",
      fieldType = authPayload,
      arguments = List(Argument("input", confirmRegistrationInput)),
      resolve = sc => resolveWithDispatcher[AuthPayload](
        input = sc.args.arg[ConfirmRegistrationInput]("input"),
        userContext = sc.ctx,
        namedResolverActor = UserResolver
      )
    ),
    Field(
      name = "resendConfirmationMessage",
      fieldType = userPayload,
      arguments = List(Argument("input", resendConfirmationMessageInput)),
      resolve = sc => resolveWithDispatcher[UserPayload](
        input = sc.args.arg[ResendConfirmationMessageInput]("input"),
        userContext = sc.ctx,
        namedResolverActor = UserResolver
      )
    ),
    Field(
      name = "login",
      fieldType = authPayload,
      arguments = List(Argument("input", loginUserInput)),
      resolve = sc => resolveWithDispatcher[AuthPayload](
        input = sc.args.arg[LoginUserInput]("input"),
        userContext = sc.ctx,
        namedResolverActor = UserResolver
      )
    ),
    Field(
      name = "forgotPassword",
      fieldType = StringType,
      arguments = List(Argument("input", forgotPasswordInput)),
      resolve = sc => resolveWithDispatcher[String](
        input = sc.args.arg[ForgotPasswordInput]("input"),
        userContext = sc.ctx,
        namedResolverActor = UserResolver
      )
    ),
    Field(
      name = "resetPassword",
      fieldType = resetPayload,
      arguments = List(Argument("input", resetPasswordInput)),
      resolve = sc => resolveWithDispatcher[ResetPayload](
        input = sc.args.arg[ResetPasswordInput]("input"),
        userContext = sc.ctx,
        namedResolverActor = UserResolver
      )
    )
  )
}