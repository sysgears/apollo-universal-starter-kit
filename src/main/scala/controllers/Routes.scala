package controllers

import akka.http.scaladsl.server.Route

object Routes {
  val Routes: Route = GraphQLController.Routes
}