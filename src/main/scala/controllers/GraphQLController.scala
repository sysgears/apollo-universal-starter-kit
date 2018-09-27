package controllers

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.marshalling.ToResponseMarshallable
import akka.http.scaladsl.model.StatusCodes._
import akka.http.scaladsl.model.sse.ServerSentEvent
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.ActorMaterializer
import graphql.{GraphQL, GraphQLContext, GraphQLContextFactory}
import javax.inject.{Inject, Singleton}
import sangria.ast.OperationType.Subscription
import sangria.execution.{ErrorWithResolver, Executor, QueryAnalysisError, QueryReducer}
import sangria.marshalling.sprayJson._
import sangria.parser.{QueryParser, SyntaxError}
import sangria.renderer.SchemaRenderer
import spray.json._

import scala.concurrent.ExecutionContext
import scala.util.control.NonFatal
import scala.util.{Failure, Success}

@Singleton
class GraphQLController @Inject()(graphQlContextFactory: GraphQLContextFactory)
                                 (implicit val executionContext: ExecutionContext,
                                  implicit val actorMaterializer: ActorMaterializer) {

  val executor = Executor(
    schema = GraphQL.Schema,
    queryReducers = List(
      QueryReducer.rejectMaxDepth[GraphQLContext](GraphQL.maxQueryDepth),
      QueryReducer.rejectComplexQueries[GraphQLContext](GraphQL.maxQueryComplexity, (_, _) => new Exception("Max query complexity"))
    )
  )

  val Routes: Route =
    path("graphql") {
      get {
        parameters('query, 'operation.?) { (query, operation) =>
          handleQuery(query, operation)
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
            handleQuery(query, operation, vars)
          }
        }
    } ~
      (path("schema") & get) {
        complete(SchemaRenderer.renderSchema(GraphQL.Schema))
      } ~
      get {
        getFromResource("web/graphiql.html")
      }

  private def handleQuery(query: String, operation: Option[String], variables: JsObject = JsObject.empty) = {
    val ctx = graphQlContextFactory.createContextForRequest
    QueryParser.parse(query) match {
      case Success(queryAst) =>
        queryAst.operationType(operation) match {
          case Some(Subscription) =>
            import akka.http.scaladsl.marshalling.sse.EventStreamMarshalling._
            import sangria.execution.ExecutionScheme.Stream
            import sangria.streaming.akkaStreams._
            complete(
              executor.prepare(queryAst, ctx, (), operation, variables)
                .map {
                  preparedQuery =>
                    ToResponseMarshallable(preparedQuery.execute()
                      .map(result => ServerSentEvent(result.compactPrint))
                      .recover {
                        case NonFatal(error) =>
                          ServerSentEvent(error.getMessage)
                      }
                    )
                }
                .recover {
                  case error: QueryAnalysisError => ToResponseMarshallable(BadRequest -> error.resolveError)
                  case error: ErrorWithResolver => ToResponseMarshallable(InternalServerError -> error.resolveError)
                }
            )
          case _ =>
            complete(
              executor.execute(queryAst, ctx, (), operation, variables)
                .map(OK -> _)
                .recover {
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
}