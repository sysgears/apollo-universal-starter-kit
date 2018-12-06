package core.graphql.schema

import common.shapes.ServerModule
import core.graphql.UserContext
import sangria.schema.{Field, IntType, ObjectType, Schema}

class GraphQL(serverModule: ServerModule) {
  val maxQueryDepth = 15
  val maxQueryComplexity = 1000

  private val dummy = ObjectType("Query", List[Field[UserContext, Unit]](Field("dummy", IntType, resolve = _ => 0)))

  val schema: Schema[UserContext, Unit] = sangria.schema.Schema(
    query = if (serverModule.queries.nonEmpty) ObjectType("Query", serverModule.queries.toList) else dummy,
    mutation = if (serverModule.mutations.nonEmpty) Some(ObjectType("Mutation", serverModule.mutations.toList)) else None,
    subscription = if (serverModule.subscriptions.nonEmpty) Some(ObjectType("Subscription", serverModule.subscriptions.toList)) else None
  )
}