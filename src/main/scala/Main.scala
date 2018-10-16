import InjectionModules.modules
import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._
import akka.stream.ActorMaterializer
import com.google.inject.Guice
import controllers.frontend.FrontendController
import controllers.graphql.GraphQLController
import net.codingwell.scalaguice.InjectorExtensions._

object Main extends App {

  val injector = Guice.createInjector(modules)
  val routes = injector.instance[GraphQLController].Routes ~ injector.instance[FrontendController].Routes

  implicit val system: ActorSystem = injector.instance[ActorSystem]
  implicit val materializer: ActorMaterializer = injector.instance[ActorMaterializer]

  Http().bindAndHandle(routes, "0.0.0.0")
}