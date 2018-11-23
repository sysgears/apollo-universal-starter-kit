package core.graphql

import core.loaders.GraphQLSchemaLoader.{mutations, queries, subscriptions}
import sangria.schema.{Field, IntType, ObjectType, Schema}

object GraphQL {

  val maxQueryDepth = 15
  val maxQueryComplexity = 1000

  private val dummy = ObjectType("Query", List[Field[UserContext, Unit]](Field("dummy", IntType, resolve = _ => 0)))

  val schema: Schema[UserContext, Unit] = sangria.schema.Schema(
    query = if (queries.nonEmpty) ObjectType("Query", queries) else dummy,
    mutation = if (mutations.nonEmpty) Some(ObjectType("Mutation", mutations)) else None,
    subscription = if (subscriptions.nonEmpty) Some(ObjectType("Subscription", subscriptions)) else None
  )
}