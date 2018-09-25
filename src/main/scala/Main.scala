import InjectionModules.Modules
import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import com.google.inject.{Guice, Injector}
import controllers.GraphQLController
import net.codingwell.scalaguice.InjectorExtensions._

object Main extends App {

  implicit val system: ActorSystem = ActorSystem("scala-starter-kit")
  implicit val materializer: ActorMaterializer = ActorMaterializer()

  val injector: Injector = Guice.createInjector(Modules)
  val routes = injector.instance[GraphQLController].Routes

  Http().bindAndHandle(routes, "0.0.0.0")
}