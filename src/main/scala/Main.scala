import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import core.AppInitialization
import core.guice.injection.Injecting
import core.loaders.AkkaRoutesLoader.routes
import core.loaders.ModuleLoader.slickSchemaModules

import scala.concurrent.ExecutionContext

object Main extends App with Injecting with AppInitialization {
  implicit val system: ActorSystem = inject[ActorSystem]
  implicit val materializer: ActorMaterializer = inject[ActorMaterializer]
  implicit val executionContext: ExecutionContext = inject[ExecutionContext]

  withActionsBefore {
    slickSchemaModules.map(_.create())
  }(Http().bindAndHandle(routes, "0.0.0.0"))
}