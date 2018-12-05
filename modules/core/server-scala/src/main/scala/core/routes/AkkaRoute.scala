package core.routes

import akka.http.scaladsl.server.Route

trait AkkaRoute {
  val routes: Route
}
