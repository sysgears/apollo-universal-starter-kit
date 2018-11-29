package graphql.schema

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import common.graphql.DispatcherResolver.resolveWithDispatcher
import common.{InputUnmarshallerGenerator, Logger}
import core.graphql.{GraphQLSchema, UserContext}
import graphql.resolvers.ItemResolver
import javax.inject.Inject
import model.PaginationParams
import model.{Item, ItemsPayload}
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

  implicit val paginationInputUnmarshaller: FromInput[PaginationParams] = inputUnmarshaller {
    input =>
      PaginationParams(
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
    implicit val PaginationInput: InputObjectType[PaginationParams] = deriveInputObjectType[PaginationParams](InputObjectTypeName("Pagination"))
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
          input = sc.args.arg[PaginationParams]("input"),
          userContext = sc.ctx,
          onException = _ => PaginationParams(offset = 0, limit = 1),
          namedResolverActor = ItemResolver
        )
      }
    )
  )
}
