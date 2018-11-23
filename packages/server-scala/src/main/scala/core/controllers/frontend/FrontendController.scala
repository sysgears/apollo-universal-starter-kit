package core.controllers.frontend

import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import core.controllers.AkkaRoute

class FrontendController extends AkkaRoute {

  override val routes: Route =
    (get & pathEndOrSingleSlash & redirectToTrailingSlashIfMissing(StatusCodes.TemporaryRedirect)) {
      getFromResource("web/frontend/index.html")
    } ~
      (path("public" / Segment) & get) { str =>
        getFromResource(s"public/$str")
      } ~ {
      getFromResourceDirectory("web/frontend")
    }
}