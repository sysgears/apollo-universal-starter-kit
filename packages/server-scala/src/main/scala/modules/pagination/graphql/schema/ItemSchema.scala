package modules.pagination.graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.graphql.DispatcherResolver.resolveWithDispatcher
import common.{InputUnmarshallerGenerator, Logger}
import core.graphql.{GraphQLSchema, UserContext}
import javax.inject.Inject
import modules.pagination.Pagination
import modules.pagination.graphql.resolvers.ItemResolver
import modules.pagination.model.{Item, ItemsPayload}
import sangria.macros.derive._
import sangria.marshalling.FromInput
import sangria.schema.{Argument, Field, InputObjectType, ObjectType}

import scala.concurrent.ExecutionContext

/**
  * Defines the graphQl scheme for working with the 'Item' objects in a paginated form.
  */
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

  /**
    * Defines a list of graphQl types for input and output data.
    */
  object Types {

    implicit val Item: ObjectType[Unit, Item] = deriveObjectType(ObjectTypeName("Item"), ExcludeFields("id"))
    implicit val ItemsPayload: ObjectType[Unit, ItemsPayload] = deriveObjectType(ObjectTypeName("ItemsPayload"))
    implicit val PaginationInput: InputObjectType[Pagination] = deriveInputObjectType[Pagination](InputObjectTypeName("Pagination"))
  }

  /**
    * List of endpoints.
    */
  override def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "getPaginatedList",
      fieldType = Types.ItemsPayload,
      arguments = List(
        Argument(name = "input", argumentType = Types.PaginationInput)
      ),
      resolve = sc => {
        resolveWithDispatcher[ItemsPayload](
          input = sc.args.arg[Pagination]("input"),
          userContext = sc.ctx,
          onException = _ => Pagination(offset = 0, limit = 1),
          namedResolverActor = ItemResolver
        )
      }
    )
  )
}
