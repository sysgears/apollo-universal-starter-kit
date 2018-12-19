package graphql

import app.GlobalModule
import com.google.inject.Singleton
import common.graphql.schema.GraphQL
import javax.inject.Inject

@Singleton
class GraphQLSchema @Inject()(globalModule: GlobalModule) extends GraphQL {
  override val serverModule: GlobalModule = globalModule
}