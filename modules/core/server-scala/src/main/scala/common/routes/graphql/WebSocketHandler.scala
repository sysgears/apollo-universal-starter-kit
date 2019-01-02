package common.routes.graphql

import akka.NotUsed
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.stream.scaladsl.{Flow, Keep, Sink, Source, SourceQueueWithComplete}
import akka.stream.{ActorMaterializer, KillSwitches, OverflowStrategy, SharedKillSwitch}
import common.graphql.UserContext
import common.graphql.schema.GraphQL
import common.routes.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import common.routes.graphql.jsonProtocols.OperationMessageJsonProtocol._
import common.routes.graphql.jsonProtocols.OperationMessageType._
import common.routes.graphql.jsonProtocols.{GraphQLMessage, OperationMessage}
import monix.execution.Scheduler
import sangria.ast.OperationType.Subscription
import sangria.execution.ExecutionScheme.Stream
import sangria.execution.Executor
import sangria.marshalling.sprayJson._
import sangria.parser.{QueryParser, SyntaxError}
import spray.json._

import scala.util.{Failure, Success}

class WebSocketHandler(graphQL: GraphQL,
                       graphQlExecutor: Executor[UserContext, Unit])
                      (implicit val actorMaterializer: ActorMaterializer,
                       implicit val scheduler: Scheduler) extends RouteUtil {

  import spray.json.DefaultJsonProtocol._

  def handleMessages: Flow[Message, Message, NotUsed] = {
    implicit val (queue, publisher) = Source.queue[Message](16, OverflowStrategy.backpressure)
      .toMat(Sink.asPublisher(false))(Keep.both)
      .run()
    val killSwitches = KillSwitches.shared(this.getClass.getSimpleName)
    val incoming = Flow[Message]
      .collect {
        case TextMessage.Strict(query) =>
          val operation = query.parseJson.convertTo[OperationMessage]
          operation.operationType match {
            case GQL_CONNECTION_INIT =>
              reply(OperationMessage(GQL_CONNECTION_ACK, None, None))
            case GQL_START =>
              handleGraphQlQuery(operation, killSwitches)
          }
      }
      .to {
        Sink.onComplete {
          _ =>
            killSwitches.shutdown
            queue.complete
        }
      }
    Flow.fromSinkAndSource(incoming, Source.fromPublisher(publisher))
  }

  private def handleGraphQlQuery(operationMessage: OperationMessage, killSwitches: SharedKillSwitch)
                                (implicit queue: SourceQueueWithComplete[Message]): Unit = {
    import sangria.streaming.akkaStreams._
    operationMessage.payload.foreach {
      payload =>
        val graphQlMessage = payload.convertTo[GraphQLMessage]
        QueryParser.parse(graphQlMessage.query) match {
          case Success(queryAst) =>
            queryAst.operationType(graphQlMessage.operationName) match {
              case Some(Subscription) =>
                graphQlExecutor.execute(
                  queryAst = queryAst,
                  userContext = UserContext(),
                  root = (),
                  operationName = graphQlMessage.operationName,
                  variables = graphQlMessage.variables.getOrElse(JsObject.empty)
                ).viaMat(killSwitches.flow)(Keep.none)
                  .runForeach {
                    result =>
                      reply(OperationMessage(GQL_DATA, operationMessage.id, Some(result)))
                  }
              case _ =>
                reply(OperationMessage(
                  GQL_ERROR,
                  operationMessage.id,
                  Some(s"Unsupported type: ${queryAst.operationType(None)}".toJson)
                ))
            }
          case Failure(e: SyntaxError) =>
            reply(OperationMessage(
              GQL_ERROR,
              operationMessage.id,
              Some(syntaxError(e))
            ))
          case Failure(_) =>
            reply(OperationMessage(
              GQL_ERROR,
              operationMessage.id,
              Some("Internal Server Error".toJson)
            ))
        }
    }
  }

  private def reply(operationMessage: OperationMessage)(implicit queue: SourceQueueWithComplete[Message]): Unit = {
    queue.offer(TextMessage(operationMessage.toJson.toString))
  }
}