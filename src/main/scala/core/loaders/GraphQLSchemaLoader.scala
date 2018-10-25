package core.loaders

import core.loaders.ModuleLoader.graphQLSchemaModules
import sangria.schema.Field

object GraphQLSchemaLoader {
  val queries: List[Field[Unit, Unit]] = graphQLSchemaModules.flatMap(_.queries)
  val mutations: List[Field[Unit, Unit]] = graphQLSchemaModules.flatMap(_.mutations)
  val subscriptions: List[Field[Unit, Unit]] = graphQLSchemaModules.flatMap(_.subscriptions)
}