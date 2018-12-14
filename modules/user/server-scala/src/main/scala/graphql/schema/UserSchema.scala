package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.graphql.DispatcherResolver._
import common.graphql.UserContext
import common.{InputUnmarshallerGenerator, Logger}
import config.AuthConfig
import graphql.resolvers.UserResolver
import javax.inject.Inject
import model.{UserPayload, _}
import modules.jwt.model.Tokens
import sangria.macros.derive._
import sangria.marshalling.FromInput
import sangria.schema.{Argument, Field, InputObjectType, ObjectType, StringType}

class UserSchema @Inject()(authConfig: AuthConfig)
                          (implicit val materializer: ActorMaterializer,
                           actorSystem: ActorSystem) extends InputUnmarshallerGenerator
  with Logger {

  implicit val registerUserInput: InputObjectType[RegisterUserInput] = deriveInputObjectType(InputObjectTypeName("RegisterUserInput"))
  implicit val confirmRegistrationInput: InputObjectType[ConfirmRegistrationInput] = deriveInputObjectType(InputObjectTypeName("ConfirmRegistrationInput"))
  implicit val resendConfirmationMessageInput: InputObjectType[ResendConfirmationMessageInput] = deriveInputObjectType(InputObjectTypeName("ResendConfirmationMessageInput"))
  implicit val user: ObjectType[UserContext, User] = deriveObjectType(ObjectTypeName("User"), ExcludeFields("password"))
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