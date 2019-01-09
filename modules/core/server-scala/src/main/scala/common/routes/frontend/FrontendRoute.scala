package common.routes.frontend

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route

class FrontendRoute {

  val routes: Route = (path("public" / Segment) & get) {
    str =>
      getFromResource(s"public/$str")
  }
}
