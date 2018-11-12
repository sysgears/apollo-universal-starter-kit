package core.controllers.graphql

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.model.Multipart.FormData
import akka.http.scaladsl.model.headers.`Set-Cookie`
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Source
import core.controllers.AkkaRoute
import core.controllers.graphql.jsonProtocols.GraphQLMessage
import core.controllers.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import core.graphql.UserContext
import spray.json.JsValue

import akka.http.scaladsl.model.Multipart
import core.graphql.GraphQL
import javax.inject.Inject
import sangria.execution.Executor
import sangria.renderer.SchemaRenderer

import scala.concurrent.ExecutionContext

class GraphQLController @Inject()(graphQlExecutor: Executor[UserContext, Unit],
                                  httpHandler: HttpHandler,
                                  webSocketHandler: WebSocketHandler)
                                 (implicit val executionContext: ExecutionContext,
                                  implicit val actorMaterializer: ActorMaterializer) extends AkkaRoute {

  override val routes: Route =
    path("graphql") {
      extractRequest {
        request =>
          get {
            handleWebSocketMessagesForProtocol(webSocketHandler.handleMessages, GraphQLMessage.graphQlWebsocketProtocol)
          } ~
            post {
              withHeaders(UserContext(request.headers.toList)) {
                userCtx =>
                  entity(as[GraphQLMessage]) {
                    graphQlMessage =>
                      httpHandler.handleQuery(graphQlMessage, userCtx)
                  } ~
                    entity(as[Seq[GraphQLMessage]]) {
                      graphQlMessages =>
                        httpHandler.handleBatchQuery(graphQlMessages, userCtx)
                    } ~
                    formFields('operations.as[GraphQLMessage], 'map.as[JsValue]) {
                      (graphQLMessage, filesOccurredJsValue) =>
                        //for each file, the key is the file multipart form field name and the value is an array of operations paths
                        val filesOccurredMap = filesOccurredJsValue.convertTo[Map[String, List[String]]]
                        entity(as[Multipart.FormData]) {
                          formData =>
                            val formDataParts: Source[FormData.BodyPart, Any] = formData.parts.filter(part => filesOccurredMap.keySet.contains(part.name))
                            httpHandler.handleQuery(graphQLMessage, userCtx.copy(filesData = formDataParts))
                        }
                    }
              }
            }
      }
    } ~
      (path("schema") & get) {
        complete(SchemaRenderer.renderSchema(GraphQL.schema))
      } ~
      (path("graphiql") & get) {
        getFromResource("web/graphiql.html")
      }

  private def withHeaders(userCtx: UserContext)(ctxToRoute: UserContext => Route) =
    mapResponseHeaders(_ ++
      userCtx.newHeaders.toList ++
      userCtx.newCookies.toList.map(`Set-Cookie`(_))
    )(ctxToRoute(userCtx))
}