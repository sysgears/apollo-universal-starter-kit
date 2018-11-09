package core.controllers.graphql

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.marshalling.ToResponseMarshallable
import akka.http.scaladsl.marshalling.sse.EventStreamMarshalling._
import akka.http.scaladsl.model.StatusCodes._
import akka.http.scaladsl.model.sse.ServerSentEvent
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.ActorMaterializer
import core.controllers.graphql.jsonProtocols.GraphQLMessage
import core.graphql.{GraphQL, UserContext}
import javax.inject.{Inject, Singleton}
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
import scala.util.control.NonFatal
import scala.util.{Failure, Success}
import akka.http.scaladsl.model.HttpHeader
import akka.http.scaladsl.model.headers.`Set-Cookie`
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.directives.RespondWithDirectives.respondWithHeaders
import core.graphql.{GraphQL, UserContext, UserContextFactory}
import monix.execution.Scheduler

@Singleton
class HttpHandler @Inject()(graphQlExecutor: Executor[UserContext, Unit],
                            graphQlBatchExecutor: BatchExecutor.type,
                            userContextFactory: UserContextFactory)
                           (implicit val scheduler: Scheduler,
                            implicit val actorMaterializer: ActorMaterializer) extends ControllerUtil {

  def handleQuery(graphQlMessage: GraphQLMessage): Route = extractRequest {
    request =>
      withHeaders(userContextFactory.createContext(request.headers.toList)) {
        userCtx =>
          QueryParser.parse(graphQlMessage.query) match {
            case Success(queryAst) =>
              val headers: ListBuffer[HttpHeader] = ListBuffer.empty
              queryAst.operationType(graphQlMessage.operationName) match {
                case Some(Subscription) =>
                  import sangria.streaming.akkaStreams._
                  respondWithHeaders(headers.toList) {
                    complete {
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
                    }
                  }
                case _ =>
                  respondWithHeaders(headers.toList) {
                    complete(
                      graphQlExecutor.execute(
                        queryAst = queryAst,
                        userContext = userCtx,
                        root = (),
                        operationName = graphQlMessage.operationName,
                        variables = graphQlMessage.variables.getOrElse(JsObject.empty)
                      ).map(OK -> _).recover {
                        case error: QueryAnalysisError => BadRequest -> error.resolveError
                        case error: ErrorWithResolver => InternalServerError -> error.resolveError
                      }
                    )
                  }
              }
            case Failure(e: SyntaxError) => complete(BadRequest, syntaxError(e))
            case Failure(_) => complete(InternalServerError)
          }
      }
  }

  def handleBatchQuery(graphQlMessages: Seq[GraphQLMessage]): Route = extractRequest {
    request =>
      import sangria.streaming.monix._
      val operations = graphQlMessages.map(_.operationName.getOrElse("")).filter(_ != "")
      withHeaders(userContextFactory.createContext(request.headers.toList)) {
        userCtx =>
          QueryParser.parse(graphQlMessages.map(_.query).mkString(" ")) match {
            case Success(queryAst) =>
              complete {
                BatchExecutor.executeBatch(
                  schema = GraphQL.schema,
                  queryAst = queryAst,
                  operationNames = operations,
                  variables = graphQlMessages.map(_.variables.getOrElse(JsObject.empty)).fold(JsObject.empty) {
                    (o1, o2) => JsObject(o1.fields ++ o2.fields)
                  },
                  userContext = userCtx,
                  queryReducers = List(
                    QueryReducer.rejectMaxDepth[UserContext](GraphQL.maxQueryDepth),
                    QueryReducer.rejectComplexQueries[UserContext](GraphQL.maxQueryComplexity, (_, _) => new Exception("maxQueryComplexity"))
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
                    OK -> jsonResponseList.toList.toJson
                }.recover {
                  case error: QueryAnalysisError => BadRequest -> error.resolveError
                  case error: ErrorWithResolver => InternalServerError -> error.resolveError
                }
              }
            case Failure(e: SyntaxError) => complete(BadRequest, syntaxError(e))
            case Failure(_) => complete(InternalServerError)
          }
      }
  }

  private def withHeaders(userCtx: UserContext)(response: UserContext => Route) =
    mapResponseHeaders(_ ++
      userCtx.newHeaders.toList ++
      userCtx.newCookies.toList.map(`Set-Cookie`(_)))(response(userCtx))
}