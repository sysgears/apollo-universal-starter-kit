import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import core.guice.injection.Injecting
import core.loaders.AkkaRoutesLoader.routes
import core.loaders.SlickSchemaLoader.generateDbSchemas

import scala.concurrent.ExecutionContext

object Main extends App with Injecting {
  implicit val system: ActorSystem = inject[ActorSystem]
  implicit val materializer: ActorMaterializer = inject[ActorMaterializer]
  implicit val executionContext: ExecutionContext = inject[ExecutionContext]

  generateDbSchemas.flatMap(_ => Http().bindAndHandle(routes, "0.0.0.0"))
}