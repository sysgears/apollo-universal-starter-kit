package core.app

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._
import akka.stream.ActorMaterializer
import ch.megard.akka.http.cors.scaladsl.CorsDirectives.cors
import ch.megard.akka.http.cors.scaladsl.settings.CorsSettings
import common.AppInitialization
import common.routes.frontend.FrontendRoute
import common.routes.graphql.GraphQLRoute
import common.shapes.ServerModule
import core.guice.injection.InjectorProvider._

import scala.concurrent.ExecutionContext

trait ModuleApp extends App with AppInitialization {

  def createApp(serverModule: ServerModule): Unit = {

    implicit val system: ActorSystem = inject[ActorSystem]
    implicit val materializer: ActorMaterializer = inject[ActorMaterializer]
    implicit val executionContext: ExecutionContext = inject[ExecutionContext]

    serverModule.fold

    val routes = List(inject[GraphQLRoute].routes, inject[FrontendRoute].routes)
    val corsSettings = CorsSettings.apply(system)

    withActionsBefore {
      serverModule.slickSchemas.map(_.createAndSeed()).toSeq
    }(
      Http().bindAndHandle(
        cors(corsSettings)(routes.reduce(_ ~ _)),
        interface = "0.0.0.0"
      )
    )
  }
}