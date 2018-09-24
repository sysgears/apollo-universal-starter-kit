package controllers

import sangria.ast.Document
import sangria.execution.{ErrorWithResolver, Executor, QueryAnalysisError, QueryReducer}
import sangria.parser.{QueryParser, SyntaxError}
import sangria.renderer.SchemaRenderer
import sangria.marshalling.sprayJson._
import spray.json._
import akka.http.scaladsl.model.StatusCodes._
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.marshalling.{ToResponseMarshallable, ToResponseMarshaller}
import akka.http.scaladsl.server.Route
import graphql.GraphQL
import javax.inject.Inject

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

object GraphQLController {

  @Inject implicit val ec: ExecutionContext = null

  val Routes: Route =
    path("graphql") {
      get {
        parameters('query, 'operation.?) { (query, operation) ⇒
          handleQuery(query, operation)
        }
      } ~
      post {
        entity(as[JsValue]) { requestJson ⇒
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
    }

  private def handleQuery(query: String, operation: Option[String], variables: JsObject = JsObject.empty) = {
    QueryParser.parse(query) match {
      case Success(queryAst) =>
        complete(executeQuery(queryAst, operation, variables)
          .map(OK → _)
          .recover {
            case error: QueryAnalysisError ⇒ BadRequest → error.resolveError
            case error: ErrorWithResolver ⇒ InternalServerError → error.resolveError
          })
      case Failure(e: SyntaxError) => complete(BadRequest)
      case Failure(_) => complete(InternalServerError)
    }
  }

  private def executeQuery(queryAst: Document, operation: Option[String], variables: JsObject = JsObject.empty) = {
    Executor.execute(
      GraphQL.Schema,
      queryAst,
      (),
      (),
      operation,
      variables,
      queryReducers = List(
        QueryReducer.rejectMaxDepth[Unit](GraphQL.maxQueryDepth),
        QueryReducer.rejectComplexQueries[Unit](GraphQL.maxQueryComplexity, (_, _) => new Exception("Max query complexity"))
      )
    )
  }
}