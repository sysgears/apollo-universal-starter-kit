package core.loaders

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import core.loaders.ModuleLoader.akkaRouteModules

object AkkaRoutesLoader {
  val routes: Route = akkaRouteModules.map(_.routes).reduce(_ ~ _)
}