package core.controllers.graphql

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.ActorMaterializer
import core.controllers.AkkaRoute
import core.controllers.graphql.jsonProtocols.GraphQLMessage
import core.controllers.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import core.graphql.GraphQL
import javax.inject.Inject
import sangria.execution.Executor
import sangria.renderer.SchemaRenderer

import scala.concurrent.ExecutionContext

class GraphQLController @Inject()(graphQlExecutor: Executor[Unit, Unit],
                                  httpHandler: HttpHandler,
                                  webSocketHandler: WebSocketHandler)
                                 (implicit val executionContext: ExecutionContext,
                                  implicit val actorMaterializer: ActorMaterializer) extends AkkaRoute {

  override val routes: Route =
    path("graphql") {
      get {
        handleWebSocketMessagesForProtocol(webSocketHandler.handleMessages, GraphQLMessage.graphQlWebsocketProtocol)
      } ~
        post {
          entity(as[GraphQLMessage]) {
            graphQlMessage =>
              httpHandler.handleQuery(graphQlMessage)
          } ~
            entity(as[Seq[GraphQLMessage]]) {
              graphQlMessages =>
                httpHandler.handleBatchQuery(graphQlMessages)
            }
        }
    } ~
      (path("schema") & get) {
        complete(SchemaRenderer.renderSchema(GraphQL.schema))
      } ~
      (path("graphiql") & get) {
        getFromResource("web/graphiql.html")
      }
}