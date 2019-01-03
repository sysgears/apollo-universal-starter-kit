package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.graphql.DispatcherResolver.resolveWithDispatcher
import common.graphql.{Extension, UserContext}
import common.{InputUnmarshallerGenerator, Logger}
import config.AuthConfig
import graphql.resolvers.AuthenticationResolver
import javax.inject.Inject
import model.facebook.FacebookAuth
import model.github.GithubAuth
import model.google.GoogleAuth
import model.linkedin.LinkedinAuth
import model._
import repositories._
import sangria.macros.derive._
import sangria.marshalling.FromInput
import sangria.schema.AstSchemaBuilder.{FieldName, TypeName}
import sangria.schema.{AdditionalTypes, Argument, AstSchemaBuilder, Field, FieldResolver, InputObjectType, ObjectType, StringType}
import sangria.macros._
import common.implicits.RichDBIO._
import modules.jwt.model.Tokens

import scala.concurrent.ExecutionContext

class AuthenticationSchema @Inject()(authConfig: AuthConfig,
                                     userProfileRepository: UserProfileRepository,
                                     facebookAuthRepo: FacebookAuthRepository,
                                     googleAuthRepository: GoogleAuthRepository,
                                     githubAuthRepository: GithubAuthRepository,
                                     linkedinAuthRepository: LinkedinAuthRepository,
                                     certificateAuthRepository: CertificateAuthRepository,
                                     userSchema: UserSchema)
                                    (implicit actorSystem: ActorSystem,
                                     materializer: ActorMaterializer,
                                     executionContext: ExecutionContext) extends InputUnmarshallerGenerator
  with Logger {

  val registerUserInput: InputObjectType[RegisterUserInput] = deriveInputObjectType(InputObjectTypeName("RegisterUserInput"))
  val confirmRegistrationInput: InputObjectType[ConfirmRegistrationInput] = deriveInputObjectType(InputObjectTypeName("ConfirmRegistrationInput"))
  val resendConfirmationMessageInput: InputObjectType[ResendConfirmationMessageInput] = deriveInputObjectType(InputObjectTypeName("ResendConfirmationMessageInput"))

  implicit val certificateAuth: ObjectType[UserContext, CertificateAuth] = deriveObjectType(ObjectTypeName("CertificateAuth"))

  implicit val facebookAuth: ObjectType[UserContext, FacebookAuth] = deriveObjectType(
    ObjectTypeName("FacebookAuth"), ExcludeFields("userId"), RenameField("id", "fbId"))

  implicit val googleAuth: ObjectType[UserContext, GoogleAuth] = deriveObjectType(
    ObjectTypeName("GoogleAuth"), ExcludeFields("userId"), RenameField("id", "googleId"))

  implicit val githubAuth: ObjectType[UserContext, GithubAuth] = deriveObjectType(
    ObjectTypeName("GithubAuth"), ExcludeFields("userId"), RenameField("id", "ghId"))

  implicit val linkedinAuth: ObjectType[UserContext, LinkedinAuth] = deriveObjectType(
    ObjectTypeName("LinkedInAuth"), ExcludeFields("userId"), RenameField("id", "lnId"))

  implicit val user: ObjectType[UserContext, User] = userSchema.user

  implicit val userAuth: ObjectType[UserContext, UserAuth] = deriveObjectType(ObjectTypeName("UserAuth"))
  val loginUserInput: InputObjectType[LoginUserInput] = deriveInputObjectType(InputObjectTypeName("LoginUserInput"))
  val authPayload: ObjectType[UserContext, AuthPayload] = deriveObjectType(ObjectTypeName("AuthPayload"))
  implicit val tokens: ObjectType[UserContext, Tokens] = deriveObjectType(ObjectTypeName("Tokens"))
  val forgotPasswordInput: InputObjectType[ForgotPasswordInput] = deriveInputObjectType(InputObjectTypeName("ForgotPasswordInput"))
  val resetPasswordInput: InputObjectType[ResetPasswordInput] = deriveInputObjectType(InputObjectTypeName("ResetPasswordInput"))
  val resetPayload: ObjectType[UserContext, ResetPayload] = deriveObjectType(ObjectTypeName("ResetPayload"))
  implicit val userPayload: ObjectType[UserContext, UserPayload] = deriveObjectType(ObjectTypeName("UserPayload"))

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

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "register",
      fieldType = userPayload,
      arguments = List(Argument("input", registerUserInput)),
      resolve = sc => resolveWithDispatcher[UserPayload](
        input = (sc.args.arg[RegisterUserInput]("input"), authConfig.skipConfirmation),
        userContext = sc.ctx,
        namedResolverActor = AuthenticationResolver
      )
    ),
    Field(
      name = "resendConfirmationMessage",
      fieldType = userPayload,
      arguments = List(Argument("input", resendConfirmationMessageInput)),
      resolve = sc => resolveWithDispatcher[UserPayload](
        input = sc.args.arg[ResendConfirmationMessageInput]("input"),
        userContext = sc.ctx,
        namedResolverActor = AuthenticationResolver
      )
    ),
    Field(
      name = "login",
      fieldType = authPayload,
      arguments = List(Argument("input", loginUserInput)),
      resolve = sc => resolveWithDispatcher[AuthPayload](
        input = sc.args.arg[LoginUserInput]("input"),
        userContext = sc.ctx,
        namedResolverActor = AuthenticationResolver
      )
    ),
    Field(
      name = "forgotPassword",
      fieldType = StringType,
      arguments = List(Argument("input", forgotPasswordInput)),
      resolve = sc => resolveWithDispatcher[String](
        input = sc.args.arg[ForgotPasswordInput]("input"),
        userContext = sc.ctx,
        namedResolverActor = AuthenticationResolver
      )
    ),
    Field(
      name = "resetPassword",
      fieldType = resetPayload,
      arguments = List(Argument("input", resetPasswordInput)),
      resolve = sc => resolveWithDispatcher[ResetPayload](
        input = sc.args.arg[ResetPasswordInput]("input"),
        userContext = sc.ctx,
        namedResolverActor = AuthenticationResolver
      )
    )
  )

  val extension: Extension[UserContext] = Extension[UserContext](
    gql"""
                 extend type User {
                   auth: UserAuth
                 }""",
    AstSchemaBuilder.resolverBased[UserContext](
      FieldResolver {
        case (TypeName("User"), FieldName("auth")) ⇒ ctx =>
          val user = ctx.value.asInstanceOf[User]
          for {
            certificate <- certificateAuthRepository.findOne(user.id.get).run
            fbAuth <- facebookAuthRepo.findOne(user.id.get).run
            gAuth <- googleAuthRepository.findOne(user.id.get).run
            ghAuth <- githubAuthRepository.findOne(user.id.get).run
            lnAuth <- linkedinAuthRepository.findOne(user.id.get).run
          } yield (certificate, fbAuth, gAuth, ghAuth, lnAuth) match {
            case (None, None, None, None, None) => None
            case _ => Some(UserAuth(certificate, fbAuth, gAuth, ghAuth, lnAuth))
          }
      },
      AdditionalTypes(userAuth, certificateAuth, googleAuth, facebookAuth, githubAuth, linkedinAuth)
    )
  )
}