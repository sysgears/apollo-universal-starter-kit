package common.routes.frontend

import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route

class FrontendRoute {

  val routes: Route =
    (get & pathEndOrSingleSlash & redirectToTrailingSlashIfMissing(StatusCodes.TemporaryRedirect)) {
      getFromResource("web/frontend/index.html")
    } ~
      (path("public" / Segment) & get) { str =>
        getFromResource(s"public/$str")
      } ~ {
      getFromResourceDirectory("web/frontend")
    }
}