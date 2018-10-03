package graphql

import models.counter.Counter
import sangria.schema.{ObjectType, Schema}

object GraphQL {
  val maxQueryDepth = 15
  val maxQueryComplexity = 1000

  val Schema: Schema[GraphQLContext, Unit] = sangria.schema.Schema(
    query = ObjectType(
      name = "Query",
      fields = Counter.GraphQL.Queries
    ),
    mutation = Some(
      ObjectType(
        name = "Mutation",
        fields = Counter.GraphQL.Mutations
      )
    ),
    subscription = Some(
      ObjectType(
        name = "Subscription",
        fields = Counter.GraphQL.Subscriptions
      )
    )
  )
}