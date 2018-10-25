import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import core.config.loaders.AkkaRoutesLoader.routes
import core.config.loaders.SlickSchemaLoader
import core.guice.injection.Injecting

import scala.concurrent.{ExecutionContext, Future}

object Main extends App with Injecting {
  implicit val system: ActorSystem = inject[ActorSystem]
  implicit val materializer: ActorMaterializer = inject[ActorMaterializer]
  implicit val executionContext: ExecutionContext = inject[ExecutionContext]

  Future.sequence(SlickSchemaLoader.slickSchemas.map(_.create())).flatMap(_ => Http().bindAndHandle(routes, "0.0.0.0"))
}