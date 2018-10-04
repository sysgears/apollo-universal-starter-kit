package controllers.graphql

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.marshalling.ToResponseMarshallable
import akka.http.scaladsl.marshalling.sse.EventStreamMarshalling._
import akka.http.scaladsl.model.StatusCodes._
import akka.http.scaladsl.model.sse.ServerSentEvent
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.StandardRoute
import akka.stream.ActorMaterializer
import controllers.graphql.jsonProtocols.GraphQLMessage
import graphql.{GraphQLContext, GraphQLContextFactory}
import javax.inject.{Inject, Singleton}
import monix.execution.Scheduler
import sangria.ast.OperationType.Subscription
import sangria.execution.ExecutionScheme.Stream
import sangria.execution.{ErrorWithResolver, Executor, QueryAnalysisError}
import sangria.marshalling.sprayJson._
import sangria.parser.{QueryParser, SyntaxError}
import spray.json._

import scala.util.control.NonFatal
import scala.util.{Failure, Success}

@Singleton
class HttpHandler @Inject()(graphQlContextFactory: GraphQLContextFactory,
                            graphQlExecutor: Executor[GraphQLContext, Unit])
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

  def handleBatchQuery(graphQlMessages: Seq[GraphQLMessage]): StandardRoute = ???
}