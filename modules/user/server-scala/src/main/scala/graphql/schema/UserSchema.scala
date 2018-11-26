package graphql.schema

import common.InputUnmarshallerGenerator
import config.AuthConfig
import core.graphql.{GraphQLSchema, UserContext}
import javax.inject.Inject
import graphql.resolvers.{TokensResolver, UserResolver}
import model._
import sangria.schema.{Argument, Field, InputObjectType, ObjectType, StringType}
import sangria.macros.derive._
import sangria.marshalling.FromInput

class UserSchema @Inject()(userResolver: UserResolver,
                           tokensResolver: TokensResolver,
                           authConfig: AuthConfig) extends GraphQLSchema
  with InputUnmarshallerGenerator {

  implicit val registerUserInput: InputObjectType[RegisterUserInput] = deriveInputObjectType(InputObjectTypeName("RegisterUserInput"))
  implicit val confirmRegistrationInput: InputObjectType[ConfirmRegistrationInput] = deriveInputObjectType(InputObjectTypeName("ConfirmRegistrationInput"))
  implicit val resendConfirmationMessageInput: InputObjectType[ResendConfirmationMessageInput] = deriveInputObjectType(InputObjectTypeName("ResendConfirmationMessageInput"))
  implicit val user: ObjectType[UserContext, User] = deriveObjectType(ObjectTypeName("User"), ExcludeFields("password"))
  implicit val UserPayload: ObjectType[UserContext, UserPayload] = deriveObjectType(ObjectTypeName("UserPayload"))
  implicit val loginUserInput: InputObjectType[LoginUserInput] = deriveInputObjectType(InputObjectTypeName("LoginUserInput"))
  implicit val tokens: ObjectType[UserContext, Tokens] = deriveObjectType(ObjectTypeName("Tokens"))
  implicit val AuthPayload: ObjectType[UserContext, AuthPayload] = deriveObjectType(ObjectTypeName("AuthPayload"))

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

  override def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "register",
      fieldType = UserPayload,
      arguments = List(Argument("input", registerUserInput)),
      resolve = sangriaContext => userResolver.register(sangriaContext.args.arg[RegisterUserInput]("input"), authConfig.skipConfirmation)
    ),
    Field(
      name = "resendConfirmationMessage",
      fieldType = UserPayload,
      arguments = List(Argument("input", resendConfirmationMessageInput)),
      resolve = sangriaContext => userResolver.resendConfirmationMessage(sangriaContext.args.arg[ResendConfirmationMessageInput]("input"))
    ),
    Field(
      name = "confirmRegistration",
      fieldType = AuthPayload,
      arguments = List(Argument("input", confirmRegistrationInput)),
      resolve = sangriaContext => userResolver.confirmRegistration(sangriaContext.args.arg[ConfirmRegistrationInput]("input"))
    ),
    Field(
      name = "login",
      fieldType = AuthPayload,
      arguments = List(Argument("input", loginUserInput)),
      resolve = sangriaContext => userResolver.login(sangriaContext.args.arg[LoginUserInput]("input"))
    ),
    Field(
      name = "refreshTokens",
      fieldType = tokens,
      arguments = List(Argument("refreshToken", StringType)),
      resolve = sangriaContext => tokensResolver.refreshTokens(sangriaContext.args.arg[String]("refreshToken"))
    ),
  )
}