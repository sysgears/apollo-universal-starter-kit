import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._
import akka.stream.ActorMaterializer
import app.GlobalModule
import ch.megard.akka.http.cors.scaladsl.CorsDirectives.cors
import ch.megard.akka.http.cors.scaladsl.settings.CorsSettings
import com.google.inject.Guice
import common.AppInitialization
import common.routes.frontend.FrontendRoute
import common.routes.graphql.GraphQLRoute
import core.guice.injection.InjectorProvider._
import core.loader.{ModuleFinder, ScalaModuleFinder}
import guice.ServerModulesBinding

import scala.collection.JavaConverters._
import scala.concurrent.ExecutionContext

object Main extends App
  with AppInitialization {

  val moduleFinder = ModuleFinder()
  val scalaModuleFinder = ScalaModuleFinder(moduleFinder)
  Guice.createInjector((scalaModuleFinder.scalaModules ++ List(new ServerModulesBinding(moduleFinder))).asJava)
  implicit val system: ActorSystem = inject[ActorSystem]
  implicit val materializer: ActorMaterializer = inject[ActorMaterializer]
  implicit val executionContext: ExecutionContext = inject[ExecutionContext]

  val globalModule = inject[GlobalModule].fold
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