package controllers

import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import graphql.GraphQL
import sangria.renderer.SchemaRenderer

object GraphQLController {
  val Routes: Route =
    path("graphql") {
      get {
        complete(HttpEntity("GET /graphql"))
      } ~
      post {
        complete(HttpEntity("POST /graphql"))
      }
    } ~
    (path("schema") & get) {
      complete(SchemaRenderer.renderSchema(GraphQL.Schema))
    }
}