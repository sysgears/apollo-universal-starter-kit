package controllers.frontend

import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import javax.inject.Singleton

@Singleton
class FrontendController {

  val Routes: Route =
    (get & pathEndOrSingleSlash & redirectToTrailingSlashIfMissing(StatusCodes.TemporaryRedirect)) {
      getFromResource("web/frontend/index.html")
    } ~ {
      getFromResourceDirectory("web/frontend")
    }
}