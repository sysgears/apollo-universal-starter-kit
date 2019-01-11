package graphql.schema

import common.graphql.UserContext
import common.{InputUnmarshallerGenerator, Logger}
import graphql.resolvers.UserResolver
import javax.inject.Inject
import model._
import repositories.UserProfileRepository
import sangria.schema.{Argument, Field, InputObjectType, IntType, ListType, ObjectType, OptionInputType, OptionType}
import sangria.macros.derive._
import sangria.marshalling.FromInput

import scala.concurrent.ExecutionContext

class UserSchema @Inject()(userResolver: UserResolver, userProfileRepository: UserProfileRepository)(
    implicit executionContext: ExecutionContext
) extends InputUnmarshallerGenerator
  with Logger {

  implicit val userProfile: ObjectType[UserContext, UserProfile] = deriveObjectType(ObjectTypeName("UserProfile"))

  implicit val user: ObjectType[UserContext, User] = deriveObjectType(
    ObjectTypeName("User"),
    ExcludeFields("password"),
    AddFields(
      Field("profile", OptionType(userProfile), resolve = {
        sangriaContext =>
          sangriaContext.value.userProfile(userProfileRepository)
      })
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
        profile = input.get("profile").flatMap(_.asInstanceOf[Option[ProfileInput]])
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
        profile = input.get("profile").flatMap(_.asInstanceOf[Option[ProfileInput]])
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

  def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "user",
      fieldType = userPayload,
      arguments = List(Argument("id", IntType)),
      resolve = ctx => userResolver.user(ctx.arg[Int]("id"))
    ),
    Field(
      name = "users",
      fieldType = ListType(user),
      arguments = List(
        Argument("orderBy", OptionInputType(orderByUserInput)),
        Argument("filter", OptionInputType(filterUserInput))
      ),
      resolve =
        ctx => userResolver.users(ctx.argOpt[OrderByUserInput]("orderBy"), ctx.argOpt[FilterUserInput]("filter"))
    )
  )

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "addUser",
      fieldType = userPayload,
      arguments = List(Argument("input", addUserInput)),
      resolve = ctx => userResolver.addUser(ctx.arg("input"))
    ),
    Field(
      name = "editUser",
      fieldType = userPayload,
      arguments = List(Argument("input", editUserInput)),
      resolve = ctx => userResolver.editUser(ctx.arg("input"))
    ),
    Field(
      name = "deleteUser",
      fieldType = userPayload,
      arguments = List(Argument("id", IntType)),
      resolve = ctx => userResolver.deleteUser(ctx.arg("id"))
    )
  )
}
