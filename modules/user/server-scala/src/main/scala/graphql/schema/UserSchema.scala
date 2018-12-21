package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.graphql.UserContext
import common.{InputUnmarshallerGenerator, Logger}
import javax.inject.Inject
import model.{User, UserProfile}
import repositories.UserProfileRepository
import sangria.schema.{Field, ObjectType, OptionType}
import sangria.macros.derive._

import scala.concurrent.ExecutionContext

class UserSchema @Inject()(userProfileRepository: UserProfileRepository)
                          (implicit val materializer: ActorMaterializer,
                           actorSystem: ActorSystem,
                           executionContext: ExecutionContext) extends InputUnmarshallerGenerator
  with Logger {

  val userProfile: ObjectType[UserContext, UserProfile] = deriveObjectType(ObjectTypeName("UserProfile"))

  val user: ObjectType[UserContext, User] = deriveObjectType(
    ObjectTypeName("User"),
    ExcludeFields("password"),
    AddFields(
      Field("profile", OptionType(userProfile), resolve = {
        sangriaContext =>
          sangriaContext.value.userProfile(userProfileRepository)
      })
    )
  )

  def queries: List[Field[UserContext, Unit]] = List(
    //TODO implement stub's functionality
    Field(
      name = "currentUser",
      fieldType = OptionType(user),
      arguments = List.empty,
      resolve = _ => None
    )
  )
}