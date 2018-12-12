import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import ch.megard.akka.http.cors.scaladsl.CorsDirectives._
import ch.megard.akka.http.cors.scaladsl.settings.CorsSettings
import core.AppInitialization
import core.guice.injection.Injecting
import core.loaders.AkkaRoutesLoader.routes
import core.loaders.ModuleLoader.slickSchemaModules

import scala.concurrent.ExecutionContext

object Main extends App with Injecting with AppInitialization {
  implicit val system: ActorSystem = inject[ActorSystem]
  implicit val materializer: ActorMaterializer = inject[ActorMaterializer]
  implicit val executionContext: ExecutionContext = inject[ExecutionContext]

  val corsSettings = CorsSettings.apply(system)

  withActionsBefore {
    slickSchemaModules.map(_.create())
  }(
    Http().bindAndHandle(
      cors(corsSettings)(routes),
      interface = "0.0.0.0"
    )
  )
}