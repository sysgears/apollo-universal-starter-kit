package core.controllers

import akka.http.scaladsl.server.Route

trait AkkaRoute {
  val routes: Route
}
