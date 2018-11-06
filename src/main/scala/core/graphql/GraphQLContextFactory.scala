package core.graphql

import akka.http.scaladsl.model.HttpRequest

object GraphQLContextFactory {

  def createGraphQLContextForRequest(implicit request: HttpRequest) = {
    GraphQLContext(request)
  }
}

case class GraphQLContext(request: HttpRequest)