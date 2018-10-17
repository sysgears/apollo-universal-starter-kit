package graphql

import models.counter.Counter
import sangria.schema.{ObjectType, Schema}

object GraphQL {
  val maxQueryDepth = 15
  val maxQueryComplexity = 1000

  val schema: Schema[GraphQLContext, Unit] = sangria.schema.Schema(
    query = ObjectType(
      name = "Query",
      fields = Counter.GraphQL.queries
    ),
    mutation = Some(
      ObjectType(
        name = "Mutation",
        fields = Counter.GraphQL.mutations
      )
    ),
    subscription = Some(
      ObjectType(
        name = "Subscription",
        fields = Counter.GraphQL.subscriptions
      )
    )
  )
}