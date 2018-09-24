package graphql

import sangria.schema.Schema

object GraphQL {
  val maxQueryDepth = 15
  val maxQueryComplexity = 1000

  val Schema: Schema[Unit, Unit] = ???
}