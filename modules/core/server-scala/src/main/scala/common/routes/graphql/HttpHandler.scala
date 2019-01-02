package common.routes.graphql

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.marshalling.ToResponseMarshallable
import akka.http.scaladsl.marshalling.sse.EventStreamMarshalling._
import akka.http.scaladsl.model.StatusCodes._
import akka.http.scaladsl.model.sse.ServerSentEvent
import akka.stream.ActorMaterializer
import common.graphql.UserContext
import common.graphql.schema.GraphQL
import common.routes.graphql.jsonProtocols.GraphQLMessage
import monix.execution.Scheduler
import sangria.ast.OperationType.Subscription
import sangria.execution.ExecutionScheme.Stream
import sangria.execution.batch.BatchExecutor
import sangria.execution.{ErrorWithResolver, Executor, QueryAnalysisError, QueryReducer}
import sangria.marshalling.sprayJson._
import sangria.parser.{QueryParser, SyntaxError}
import spray.json.DefaultJsonProtocol._
import spray.json._

import scala.collection.mutable.ListBuffer
import scala.concurrent.Future
import scala.util.control.NonFatal
import scala.util.{Failure, Success}

class HttpHandler(graphQL: GraphQL,
                  graphQlExecutor: Executor[UserContext, Unit])
                 (implicit val scheduler: Scheduler,
                  implicit val actorMaterializer: ActorMaterializer) extends RouteUtil {

  def handleQuery(graphQlMessage: GraphQLMessage, userCtx: UserContext): Future[ToResponseMarshallable] =
    QueryParser.parse(graphQlMessage.query) match {
      case Success(queryAst) =>
        queryAst.operationType(graphQlMessage.operationName) match {
          case Some(Subscription) =>
            import sangria.streaming.akkaStreams._
            graphQlExecutor.prepare(
              queryAst = queryAst,
              userContext = userCtx,
              root = (),
              operationName = graphQlMessage.operationName,
              variables = graphQlMessage.variables.getOrElse(JsObject.empty)
            ).map {
              preparedQuery =>
                ToResponseMarshallable(preparedQuery.execute()
                  .map(r => ServerSentEvent(r.compactPrint))
                  .recover {
                    case NonFatal(error) =>
                      ServerSentEvent(error.getMessage)
                  }
                )
            }.recover {
              case error: QueryAnalysisError => ToResponseMarshallable(BadRequest -> error.resolveError)
              case error: ErrorWithResolver => ToResponseMarshallable(InternalServerError -> error.resolveError)
            }
          case _ =>
            graphQlExecutor.execute(
              queryAst = queryAst,
              userContext = userCtx,
              root = (),
              operationName = graphQlMessage.operationName,
              variables = graphQlMessage.variables.getOrElse(JsObject.empty)
            ).map(response => ToResponseMarshallable(OK -> response)).recover {
              case error: QueryAnalysisError => BadRequest -> error.resolveError
              case error: ErrorWithResolver => InternalServerError -> error.resolveError
            }
        }
      case Failure(e: SyntaxError) => Future[ToResponseMarshallable](BadRequest, syntaxError(e))
      case Failure(_) => Future[ToResponseMarshallable](InternalServerError)
    }

  def handleBatchQuery(graphQlMessages: Seq[GraphQLMessage], userCtx: UserContext): Future[ToResponseMarshallable] = {
    import sangria.streaming.monix._
    val operations = graphQlMessages.map(_.operationName.getOrElse("")).filter(_ != "")
    QueryParser.parse(graphQlMessages.map(_.query).mkString(" ")) match {
      case Success(queryAst) =>
        BatchExecutor.executeBatch(
          schema = graphQL.schema,
          queryAst = queryAst,
          operationNames = operations,
          variables = graphQlMessages.map(_.variables.getOrElse(JsObject.empty)).fold(JsObject.empty) {
            (o1, o2) => JsObject(o1.fields ++ o2.fields)
          },
          userContext = userCtx,
          queryReducers = List(
            QueryReducer.rejectMaxDepth[UserContext](graphQL.maxQueryDepth),
            QueryReducer.rejectComplexQueries[UserContext](graphQL.maxQueryComplexity, (_, _) => new Exception("maxQueryComplexity"))
          ),
          middleware = List(
            BatchExecutor.OperationNameExtension
          )
        ).toListL.runAsync.map {
          jsonResponse =>
            var jsonResponseList = new ListBuffer[JsValue]()
            operations.foreach {
              operation =>
                jsonResponse.find {
                  jsonElement =>
                    jsonElement
                      .asJsObject.fields("extensions")
                      .asJsObject.fields("batch")
                      .asJsObject.fields("operationName")
                      .convertTo[String] == operation
                }.foreach(jsonResponseList += _)
            }
            ToResponseMarshallable(OK -> jsonResponseList.toList.toJson)
        }.recover {
          case error: QueryAnalysisError => BadRequest -> error.resolveError
          case error: ErrorWithResolver => InternalServerError -> error.resolveError
        }
      case Failure(e: SyntaxError) => Future[ToResponseMarshallable](BadRequest, syntaxError(e))
      case Failure(_) => Future[ToResponseMarshallable](InternalServerError)
    }
  }
}