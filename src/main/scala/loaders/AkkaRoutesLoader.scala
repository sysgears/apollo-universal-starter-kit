package loaders

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import core.controllers.AkkaRoute
import core.guice.injection.Injecting.loadClasses

object AkkaRoutesLoader {
  val routes: Route = loadClasses[AkkaRoute]("akka.routes").map(_.routes).reduce(_ ~ _)
}