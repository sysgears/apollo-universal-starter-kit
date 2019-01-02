package core.app

import akka.http.scaladsl.server.Route
import common.graphql.UserContext
import common.routes.frontend.FrontendRoute
import common.slick.SchemaInitializer
import core.guice.bindings.CoreBinding
import core.guice.injection.InjectorProvider._
import shapes.ServerModule

import scala.collection.mutable

class CoreModule extends ServerModule[UserContext, SchemaInitializer[_]] {

  lazy val frontendRoute: FrontendRoute = inject[FrontendRoute]

  override lazy val routes: mutable.HashSet[Route] = mutable.HashSet(frontendRoute.routes)

  bindings = new CoreBinding
}