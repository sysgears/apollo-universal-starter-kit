package graphql.schema

import common.InputUnmarshallerGenerator
import core.graphql.{GraphQLSchema, UserContext}
import javax.inject.Inject
import graphql.resolvers.UserResolver
import model.{RegisterUserInput, User, UserPayload}
import sangria.schema.{Argument, Field, InputObjectType, ObjectType}
import sangria.macros.derive._
import sangria.marshalling.FromInput

class UserSchema @Inject()(userResolver: UserResolver) extends GraphQLSchema
  with InputUnmarshallerGenerator {

  implicit val registerUserInput: InputObjectType[RegisterUserInput] = deriveInputObjectType(InputObjectTypeName("RegisterUserInput"))
  implicit val user: ObjectType[UserContext, User] = deriveObjectType(ObjectTypeName("User"), ExcludeFields("password"))
  implicit val UserPayload: ObjectType[UserContext, UserPayload] = deriveObjectType(ObjectTypeName("UserPayload"))

  implicit val registerUserInputUnmarshaller: FromInput[RegisterUserInput] = inputUnmarshaller {
    input =>
      RegisterUserInput(
        username = input("username").asInstanceOf[String],
        email = input("email").asInstanceOf[String],
        password = input("password").asInstanceOf[String]
      )
  }

  override def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "register",
      fieldType = UserPayload,
      arguments = List(Argument("input", registerUserInput)),
      resolve = sangriaContext => userResolver.register(sangriaContext.args.arg[RegisterUserInput]("input"))
    )
  )
}