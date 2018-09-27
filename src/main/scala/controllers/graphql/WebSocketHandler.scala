package controllers.graphql

import akka.http.scaladsl.model.HttpResponse
import akka.http.scaladsl.model.ws.{Message, TextMessage, UpgradeToWebSocket}
import akka.stream.scaladsl.{Flow, Keep, Sink, Source}
import akka.stream.{ActorMaterializer, KillSwitches, OverflowStrategy}
import graphql.{GraphQLContext, GraphQLContextFactory}
import javax.inject.{Inject, Singleton}
import sangria.ast.OperationType.Subscription
import sangria.execution.Executor
import sangria.marshalling.sprayJson._
import sangria.parser.{QueryParser, SyntaxError}
import spray.json._

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

@Singleton
class WebSocketHandler @Inject()(graphQlContextFactory: GraphQLContextFactory,
                                 graphQlExecutor: Executor[GraphQLContext, Unit])
                                (implicit val executionContext: ExecutionContext,
                                 implicit val actorMaterializer: ActorMaterializer) {

  def handleQuery(upgradeToWebSocket: UpgradeToWebSocket): HttpResponse = {
    val (queue, publisher) = Source.queue[Message](0, OverflowStrategy.fail)
      .toMat(Sink.asPublisher(false))(Keep.both)
      .run()
    val killSwitches = KillSwitches.shared("WebSocketHandler")
    val incoming = Flow[Message]
      .collect {
        case TextMessage.Strict(query) =>
          QueryParser.parse(query) match {
            case Success(queryAst) =>
              queryAst.operationType(None) match {
                case Some(Subscription) =>
                  import sangria.execution.ExecutionScheme.Stream
                  import sangria.streaming.akkaStreams._
                  val ctx = graphQlContextFactory.createContextForRequest
                  graphQlExecutor.execute(queryAst, ctx, (), None)
                    .viaMat(killSwitches.flow)(Keep.right)
                    .runForeach(result => queue.offer(TextMessage(result.compactPrint)))
                case _ =>
                  queue.offer(TextMessage(s"Unsupported type: ${queryAst.operationType(None)}"))
              }
            case Failure(e: SyntaxError) =>
              queue.offer(
                TextMessage(
                  JsObject(
                    "syntaxError" -> JsString(e.getMessage),
                    "locations" -> JsArray(
                      JsObject(
                        "line" -> JsNumber(e.originalError.position.line),
                        "column" -> JsNumber(e.originalError.position.column)
                      )
                    )
                  ).compactPrint
                )
              )
            case Failure(_) =>
              queue.offer(TextMessage(s"Internal Server Error"))
          }
      }
      .to(Sink.onComplete {
        _ =>
          killSwitches.shutdown()
          queue.complete()
      })
    upgradeToWebSocket.handleMessagesWithSinkSource(incoming, Source.fromPublisher(publisher))
  }
}