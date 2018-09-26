import InjectionModules.Modules
import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import com.google.inject.Guice
import controllers.GraphQLController
import net.codingwell.scalaguice.InjectorExtensions._

object Main extends App {

  val injector = Guice.createInjector(Modules)
  val routes = injector.instance[GraphQLController].Routes

  implicit val system: ActorSystem = injector.instance[ActorSystem]
  implicit val materializer: ActorMaterializer = injector.instance[ActorMaterializer]

  Http().bindAndHandle(routes, "0.0.0.0")
}