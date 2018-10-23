package core.graphql

import core.config.loaders.GraphQLSchemaLoader
import sangria.schema.{ObjectType, Schema}

object GraphQL {
  val maxQueryDepth = 15
  val maxQueryComplexity = 1000

  val schema: Schema[Unit, Unit] = sangria.schema.Schema(
    query = ObjectType(
      name = "Query",
      fields = GraphQLSchemaLoader.queries
    ),
    mutation = Some(
      ObjectType(
        name = "Mutation",
        fields = GraphQLSchemaLoader.mutations
      )
    ),
    subscription = Some(
      ObjectType(
        name = "Subscription",
        fields = GraphQLSchemaLoader.subscriptions
      )
    )
  )
}