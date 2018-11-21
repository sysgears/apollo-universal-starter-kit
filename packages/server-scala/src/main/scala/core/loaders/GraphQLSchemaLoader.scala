package core.loaders

import core.graphql.UserContext
import core.loaders.ModuleLoader.graphQLSchemaModules
import sangria.schema.Field

object GraphQLSchemaLoader {
  val queries: List[Field[UserContext, Unit]] = graphQLSchemaModules.flatMap(_.queries)
  val mutations: List[Field[UserContext, Unit]] = graphQLSchemaModules.flatMap(_.mutations)
  val subscriptions: List[Field[UserContext, Unit]] = graphQLSchemaModules.flatMap(_.subscriptions)
}