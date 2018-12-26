package core.app

import akka.http.scaladsl.server.Route
import common.routes.frontend.FrontendRoute
import common.shapes.ServerModule
import core.guice.injection.InjectorProvider._
import core.guice.bindings.CoreBinding

import scala.collection.mutable

class CoreModule extends ServerModule {

  lazy val frontendRoute: FrontendRoute = inject[FrontendRoute]

  override lazy val routes: mutable.HashSet[Route] = mutable.HashSet(frontendRoute.routes)

  bindings = new CoreBinding
}