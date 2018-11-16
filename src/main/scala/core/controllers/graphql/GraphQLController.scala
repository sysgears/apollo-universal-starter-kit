package core.controllers.graphql

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.marshalling.ToResponseMarshallable
import akka.http.scaladsl.model.headers.`Set-Cookie`
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.ActorMaterializer
import core.controllers.AkkaRoute
import core.controllers.graphql.jsonProtocols.GraphQLMessage
import core.controllers.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import core.graphql.{GraphQL, UserContext}
import javax.inject.Inject
import sangria.execution.Executor
import sangria.renderer.SchemaRenderer

import scala.concurrent.ExecutionContext
import scala.util.Try

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
                      onComplete(httpHandler.handleQuery(graphQlMessage, userCtx)) {
                        response: Try[ToResponseMarshallable] => complete(response)
                      }
                  } ~
                    entity(as[Seq[GraphQLMessage]]) {
                      graphQlMessages =>
                        onComplete(httpHandler.handleBatchQuery(graphQlMessages, userCtx)) {
                          response: Try[ToResponseMarshallable] => complete(response)
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