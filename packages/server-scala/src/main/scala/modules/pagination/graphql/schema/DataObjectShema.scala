package modules.pagination.graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.Logger
import common.graphql.DispatcherResolver.resolveWithDispatcher
import core.graphql.{GraphQLSchema, UserContext}
import core.services.publisher.PubSubService
import core.services.publisher.RichPubSubService._
import javax.inject.Inject
import modules.pagination.Pagination
import modules.pagination.graphql.resolvers.DataObjectResolver
import modules.pagination.model.{DataObject, DataObjectsPayload}
import sangria.macros.derive.{ExcludeFields, ObjectTypeName, deriveObjectType}
import sangria.schema.{Argument, Field, IntType, ObjectType}

import scala.concurrent.ExecutionContext

class DataObjectShema @Inject()(implicit val pubsubService: PubSubService[DataObjectsPayload],
                                materializer: ActorMaterializer,
                                actorSystem: ActorSystem,
                                executionContext: ExecutionContext) extends GraphQLSchema
  with Logger {

  implicit val dataObject: ObjectType[Unit, DataObject] = deriveObjectType(ObjectTypeName("DataObject"), ExcludeFields("id"))
  implicit val dataObjectPayload: ObjectType[Unit, DataObjectsPayload] = deriveObjectType(ObjectTypeName("DataObjectsPayload"))

  override def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "getPaginatedList",
      fieldType = dataObjectPayload,
      arguments = List(
        Argument(name = "offset", argumentType = IntType),
        Argument(name = "limit", argumentType = IntType)
      ),
      resolve = sc => {
        val offset = sc.args.arg[Int]("offset")
        val limit = sc.args.arg[Int]("limit")
        resolveWithDispatcher[DataObjectsPayload](
          input = Pagination(offset, limit),
          userContext = sc.ctx,
          onException = _ => Pagination(offset = 0, limit = 1),
          namedResolverActor = DataObjectResolver
        ).pub
      }
    )
  )

}
