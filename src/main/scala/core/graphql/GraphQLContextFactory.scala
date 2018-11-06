package core.graphql

class GraphQLContextFactory {

  def createGraphQLContextForRequest() = {
    GraphQLContext()
  }
}

case class GraphQLContext()