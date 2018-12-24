package common.graphql.schema

import common.shapes.ServerModule

class GraphQLSchema(module: ServerModule) extends GraphQL {
  override val serverModule: ServerModule = module
}