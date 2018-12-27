package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.graphql.UserContext
import common.{InputUnmarshallerGenerator, Logger}
import javax.inject.Inject
import model._
import repositories.UserProfileRepository
import sangria.schema.{Argument, Field, InputObjectType, ObjectType, OptionType}
import sangria.macros.derive._
import sangria.marshalling.FromInput

import scala.concurrent.ExecutionContext

class UserSchema @Inject()(userProfileRepository: UserProfileRepository)
                          (implicit val materializer: ActorMaterializer,
                           actorSystem: ActorSystem,
                           executionContext: ExecutionContext) extends InputUnmarshallerGenerator
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

  def queries: List[Field[UserContext, Unit]] = List(
    //TODO implement stub's functionality
    Field(
      name = "currentUser",
      fieldType = OptionType(user),
      arguments = List.empty,
      resolve = _ => None
    )
  )

  def mutations: List[Field[UserContext, Unit]] = List(
    //TODO implement stub's functionality
    Field(
      name = "addUser",
      fieldType = userPayload,
      arguments = List(Argument("input", addUserInput)),
      resolve = sc => UserPayload(Some(User(Some(1), "testusername", "testmail", "testpass", "user", true)))
    )
  )
}