import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._
import akka.stream.ActorMaterializer
import app._
import ch.megard.akka.http.cors.scaladsl.CorsDirectives.cors
import ch.megard.akka.http.cors.scaladsl.settings.CorsSettings
import com.google.inject.Guice
import common.AppInitialization
import common.routes.frontend.FrontendRoute
import common.routes.graphql.GraphQLRoute
import core.guice.injection.InjectorProvider._
import guice.GlobalBinding

import scala.concurrent.ExecutionContext

object Main extends App
  with AppInitialization {

  val injector = Guice.createInjector(new GlobalBinding)
  val globalModule = inject[GlobalModule]

  implicit val system: ActorSystem = inject[ActorSystem]
  implicit val materializer: ActorMaterializer = inject[ActorMaterializer]
  implicit val executionContext: ExecutionContext = inject[ExecutionContext]

  globalModule.fold
  val routes = List(inject[GraphQLRoute].routes, inject[FrontendRoute].routes)
  val corsSettings = CorsSettings.apply(system)

  withActionsBefore {
    globalModule.slickSchemas.map(_.create()).toSeq
  }(
    Http().bindAndHandle(
      cors(corsSettings)(routes.reduce(_ ~ _)),
      interface = "0.0.0.0"
    )
  )
}