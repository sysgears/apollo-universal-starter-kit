package core.controllers.graphql

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.marshalling.ToResponseMarshallable
import akka.http.scaladsl.marshalling.sse.EventStreamMarshalling._
import akka.http.scaladsl.model.StatusCodes._
import akka.http.scaladsl.model.sse.ServerSentEvent
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.StandardRoute
import akka.stream.ActorMaterializer
import core.controllers.graphql.jsonProtocols.GraphQLMessage
import graphql.{GraphQL, GraphQLContext, GraphQLContextFactory}
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

@Singleton
class HttpHandler @Inject()(graphQlContextFactory: GraphQLContextFactory,
                            graphQlExecutor: Executor[GraphQLContext, Unit],
                            graphQlBatchExecutor: BatchExecutor.type)
                           (implicit val scheduler: Scheduler,
                            implicit val actorMaterializer: ActorMaterializer) {

  def handleQuery(graphQlMessage: GraphQLMessage): StandardRoute = {
    QueryParser.parse(graphQlMessage.query) match {
      case Success(queryAst) =>
        val ctx = graphQlContextFactory.createContextForRequest
        queryAst.operationType(graphQlMessage.operationName) match {
          case Some(Subscription) =>
            import sangria.streaming.akkaStreams._
            complete {
              graphQlExecutor.prepare(
                queryAst = queryAst,
                userContext = ctx,
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
          case _ =>
            complete(
              graphQlExecutor.execute(
                queryAst = queryAst,
                userContext = ctx,
                root = (),
                operationName = graphQlMessage.operationName,
                variables = graphQlMessage.variables.getOrElse(JsObject.empty)
              ).map(OK -> _).recover {
                case error: QueryAnalysisError => BadRequest -> error.resolveError
                case error: ErrorWithResolver => InternalServerError -> error.resolveError
              }
            )
        }
      case Failure(e: SyntaxError) =>
        complete(
          BadRequest,
          JsObject(
            "syntaxError" -> JsString(e.getMessage),
            "locations" -> JsArray(
              JsObject(
                "line" -> JsNumber(e.originalError.position.line),
                "column" -> JsNumber(e.originalError.position.column)
              )
            )
          )
        )
      case Failure(_) => complete(InternalServerError)
    }
  }

  def handleBatchQuery(graphQlMessages: Seq[GraphQLMessage]): StandardRoute = {
    import sangria.streaming.monix._
    val operations = graphQlMessages.map(_.operationName.getOrElse("")).filter(_ != "")
    QueryParser.parse(graphQlMessages.map(_.query).mkString(" ")) match {
      case Success(queryAst) =>
        val ctx = graphQlContextFactory.createContextForRequest
        complete {
          BatchExecutor.executeBatch(
            schema = GraphQL.schema,
            queryAst = queryAst,
            operationNames = operations,
            userContext = ctx,
            variables = graphQlMessages.map(_.variables.getOrElse(JsObject.empty)).fold(JsObject.empty) {
              (o1, o2) => JsObject(o1.fields ++ o2.fields)
            },
            queryReducers = List(
              QueryReducer.rejectMaxDepth[GraphQLContext](GraphQL.maxQueryDepth),
              QueryReducer.rejectComplexQueries[GraphQLContext](GraphQL.maxQueryComplexity, (_, _) => new Exception("maxQueryComplexity"))
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
      case Failure(e: SyntaxError) =>
        complete(
          BadRequest,
          JsObject(
            "syntaxError" -> JsString(e.getMessage),
            "locations" -> JsArray(
              JsObject(
                "line" -> JsNumber(e.originalError.position.line),
                "column" -> JsNumber(e.originalError.position.column)
              )
            )
          )
        )
      case Failure(_) => complete(InternalServerError)
    }
  }
}