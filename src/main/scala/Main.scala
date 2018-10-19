import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import injection.Injecting
import loaders.AkkaRoutesLoader.routes

object Main extends App with Injecting {
  implicit val system: ActorSystem = inject[ActorSystem]
  implicit val materializer: ActorMaterializer = inject[ActorMaterializer]

  Http().bindAndHandle(routes, "0.0.0.0")
}