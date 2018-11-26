package modules.pagination.graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.graphql.DispatcherResolver.resolveWithDispatcher
import common.{InputUnmarshallerGenerator, Logger}
import core.graphql.{GraphQLSchema, UserContext}
import javax.inject.Inject
import modules.pagination.Pagination
import modules.pagination.graphql.resolvers.DataObjectResolver
import modules.pagination.model.{DataObject, DataObjectsPayload}
import sangria.macros.derive._
import sangria.marshalling.FromInput
import sangria.schema.{Argument, Field, InputObjectType, ObjectType}

import scala.concurrent.ExecutionContext

class ItemSchema @Inject()(implicit val materializer: ActorMaterializer,
                           actorSystem: ActorSystem,
                           executionContext: ExecutionContext) extends GraphQLSchema with InputUnmarshallerGenerator
  with Logger {

  implicit val paginationInputUnmarshaller: FromInput[Pagination] = inputUnmarshaller {
    input =>
      Pagination(
        offset = input("offset").asInstanceOf[Int],
        limit = input("limit").asInstanceOf[Int]
      )
  }

  object Types {

    implicit val DataObject: ObjectType[Unit, DataObject] = deriveObjectType(ObjectTypeName("DataObject"), ExcludeFields("id"))
    implicit val DataObjectPayload: ObjectType[Unit, DataObjectsPayload] = deriveObjectType(ObjectTypeName("DataObjectsPayload"))
    implicit val PaginationInput: InputObjectType[Pagination] = deriveInputObjectType[Pagination](InputObjectTypeName("Pagination"))
  }

  override def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "getPaginatedList",
      fieldType = Types.DataObjectPayload,
      arguments = List(
        Argument(name = "input", argumentType = Types.PaginationInput)
      ),
      resolve = sc => {
        resolveWithDispatcher[DataObjectsPayload](
          input = sc.args.arg[Pagination]("input"),
          userContext = sc.ctx,
          onException = _ => Pagination(offset = 0, limit = 1),
          namedResolverActor = ItemResolver
        )
      }
    )
  )
}
