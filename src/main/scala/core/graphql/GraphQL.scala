package core.graphql

import core.loaders.GraphQLSchemaLoader
import sangria.schema.{Field, IntType, ObjectType, Schema}

object GraphQL {

  val maxQueryDepth = 15
  val maxQueryComplexity = 1000

  private val dummy = ObjectType(
    name = "Query",
    fields = List[Field[Unit, Unit]](
      Field(
        name = "dummy",
        fieldType = IntType,
        resolve = _ => 0
      )
    )
  )

  val schema: Schema[Unit, Unit] = sangria.schema.Schema(
    query =
      if (GraphQLSchemaLoader.queries.isEmpty) {
        dummy
      } else {
        ObjectType(
          name = "Query",
          fields = GraphQLSchemaLoader.queries
        )
      },
    mutation =
      if (GraphQLSchemaLoader.mutations.isEmpty) {
        None
      } else {
        Some(
          ObjectType(
            name = "Mutation",
            fields = GraphQLSchemaLoader.mutations
          )
        )
      },
    subscription =
      if (GraphQLSchemaLoader.subscriptions.isEmpty) {
        None
      } else {
        Some(
          ObjectType(
            name = "Subscription",
            fields = GraphQLSchemaLoader.subscriptions
          )
        )
      }
  )
}