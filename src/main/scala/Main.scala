import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._
import akka.stream.ActorMaterializer
import controllers.frontend.FrontendController
import controllers.graphql.GraphQLController
import util.Injecting

object Main extends App with Injecting {
  val routes = inject[GraphQLController].Routes ~ inject[FrontendController].Routes

  implicit val system: ActorSystem = inject[ActorSystem]
  implicit val materializer: ActorMaterializer = inject[ActorMaterializer]

  Http().bindAndHandle(routes, "0.0.0.0")
}