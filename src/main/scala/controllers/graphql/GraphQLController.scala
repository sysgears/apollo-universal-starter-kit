package controllers.graphql

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.model.ws.UpgradeToWebSocket
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.directives.HeaderDirectives.optionalHeaderValueByType
import akka.stream.ActorMaterializer
import controllers.graphql.jsonProtocols.GraphQLMessage
import controllers.graphql.jsonProtocols.GraphQLMessageProtocol._
import graphql.{GraphQL, GraphQLContext, GraphQLContextFactory}
import javax.inject.{Inject, Singleton}
import sangria.execution.Executor
import sangria.renderer.SchemaRenderer

import scala.concurrent.ExecutionContext

@Singleton
class GraphQLController @Inject()(graphQlContextFactory: GraphQLContextFactory,
                                  graphQlExecutor: Executor[GraphQLContext, Unit],
                                  httpHandler: HttpHandler,
                                  webSocketHandler: WebSocketHandler)
                                 (implicit val executionContext: ExecutionContext,
                                  implicit val actorMaterializer: ActorMaterializer) {

  val Routes: Route =
    path("graphql") {
      get {
        optionalHeaderValueByType[UpgradeToWebSocket](()) {
          case Some(upgrade) =>
            complete(webSocketHandler.handleMessages(upgrade))
          case None =>
            entity(as[GraphQLMessage]) {
              graphQlMessage =>
                httpHandler.handleQuery(graphQlMessage)
            }
        }
      } ~
        post {
          entity(as[GraphQLMessage]) {
            graphQlMessage =>
              httpHandler.handleQuery(graphQlMessage)
          }
          entity(as[Seq[GraphQLMessage]]) {
            graphQlMessages =>
              httpHandler.handleBatchQuery(graphQlMessages)
          }
        }
    } ~
      (path("schema") & get) {
        complete(SchemaRenderer.renderSchema(GraphQL.Schema))
      } ~
      (path("graphiql") & get) {
        getFromResource("web/graphiql.html")
      }
}