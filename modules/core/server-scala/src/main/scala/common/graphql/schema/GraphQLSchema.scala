package common.graphql.schema

import common.graphql.UserContext
import common.slick.SchemaInitializer
import shapes.ServerModule

class GraphQLSchema(module: ServerModule[UserContext, SchemaInitializer[_]]) extends GraphQL {
  override val serverModule: ServerModule[UserContext, SchemaInitializer[_]] = module
}
