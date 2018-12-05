package app

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._
import akka.stream.ActorMaterializer
import ch.megard.akka.http.cors.scaladsl.CorsDirectives.cors
import ch.megard.akka.http.cors.scaladsl.settings.CorsSettings
import controllers.frontend.FrontendController
import controllers.graphql.GraphQLController
import core.AppInitialization
import core.guice.injection.Injecting

import scala.concurrent.ExecutionContext

object Main extends App with Injecting with AppInitialization {
  implicit val system: ActorSystem = inject[ActorSystem]
  implicit val materializer: ActorMaterializer = inject[ActorMaterializer]
  implicit val executionContext: ExecutionContext = inject[ExecutionContext]

  val appServerModule = inject[AppServerModule]
  appServerModule.fold()

  val routes = List(inject[GraphQLController], inject[FrontendController])
  val corsSettings = CorsSettings.apply(system)

  withActionsBefore {
    appServerModule.slickSchemas.map(_.create()).toSeq
  }(
    Http().bindAndHandle(
      cors(corsSettings)(routes.map(_.routes).reduce(_ ~ _)),
      interface = "0.0.0.0"
    )
  )
}