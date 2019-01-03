import common.graphql.UserContext
import common.graphql.schema.GraphQL
import common.slick.SchemaInitializer
import shapes.ServerModule

class TestGraphQLSchema(module: ServerModule[UserContext, SchemaInitializer[_]]) extends GraphQL {
  override val serverModule: ServerModule[UserContext, SchemaInitializer[_]] = module
}