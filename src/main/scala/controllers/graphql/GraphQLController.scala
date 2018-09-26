package controllers.graphql

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.model.ws.UpgradeToWebSocket
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.directives.HeaderDirectives.optionalHeaderValueByType
import akka.stream.ActorMaterializer
import graphql.{GraphQL, GraphQLContext, GraphQLContextFactory}
import javax.inject.{Inject, Singleton}
import sangria.execution.Executor
import sangria.renderer.SchemaRenderer
import spray.json._

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
            complete(webSocketHandler.handleQuery(upgrade))
          case None =>
            parameters('query, 'operation.?) {
              (query, operation) =>
                httpHandler.handleQuery(query, operation)
            }
        }
      } ~
        post {
          entity(as[JsValue]) { requestJson =>
            val JsObject(fields) = requestJson
            val JsString(query) = fields("query")
            val operation = fields.get("operationName") collect {
              case JsString(op) => op
            }
            val vars = fields.get("variables") match {
              case Some(obj: JsObject) => obj
              case _ => JsObject.empty
            }
            httpHandler.handleQuery(query, operation, vars)
          }
        }
    } ~
      (path("schema") & get) {
        complete(SchemaRenderer.renderSchema(GraphQL.Schema))
      }
}