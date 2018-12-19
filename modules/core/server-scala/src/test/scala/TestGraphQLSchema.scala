import common.graphql.schema.GraphQL
import common.shapes.ServerModule

class TestGraphQLSchema(module: ServerModule) extends GraphQL {
  override val serverModule: ServerModule = module
}