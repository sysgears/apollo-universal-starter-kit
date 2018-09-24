import InjectionModules.Modules
import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import com.google.inject.Guice
import controllers.Routes.Routes

object Main extends App {

  implicit val system: ActorSystem = ActorSystem("scala-starter-kit")
  implicit val materializer: ActorMaterializer = ActorMaterializer()

  Guice.createInjector(Modules)
  Http().bindAndHandle(Routes, "0.0.0.0")
}