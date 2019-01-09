package core.app

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._
import akka.stream.ActorMaterializer
import ch.megard.akka.http.cors.scaladsl.CorsDirectives.cors
import ch.megard.akka.http.cors.scaladsl.settings.CorsSettings
import com.google.inject.Guice.createInjector
import common.AppInitialization
import common.graphql.UserContext
import common.graphql.schema.{GraphQL, GraphQLSchema}
import common.routes.graphql.{GraphQLRoute, HttpHandler, WebSocketHandler}
import common.slick.SchemaInitializer
import core.guice.injection.InjectorProvider._
import modules.session.JWTSessionImpl
import monix.execution.Scheduler
import sangria.execution.{Executor, QueryReducer}
import shapes.ServerModule

import scala.concurrent.ExecutionContext

trait ModuleApp extends App with AppInitialization {

  def createApp(serverModule: ServerModule[UserContext, SchemaInitializer[_]]): Unit = {

    createInjector(serverModule.foldBindings.bindings)
    serverModule.fold

    implicit val system: ActorSystem = inject[ActorSystem]
    implicit val materializer: ActorMaterializer = inject[ActorMaterializer]
    implicit val executionContext: ExecutionContext = inject[ExecutionContext]
    implicit val scheduler: Scheduler = inject[Scheduler]

    val graphQL = new GraphQLSchema(serverModule)
    val graphQlExecutor = executor(graphQL)
    val httpHandler = new HttpHandler(graphQL, graphQlExecutor)
    val webSocketHandler = new WebSocketHandler(graphQL, graphQlExecutor)
    val graphQLRoute = new GraphQLRoute(httpHandler, inject[JWTSessionImpl], webSocketHandler, graphQL)
    val routes = serverModule.routes + graphQLRoute.routes

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

  def executor(graphQL: GraphQL)(implicit executionContext: ExecutionContext): Executor[UserContext, Unit] = Executor(
    schema = graphQL.schema,
    queryReducers = List(
      QueryReducer.rejectMaxDepth[UserContext](graphQL.maxQueryDepth),
      QueryReducer.rejectComplexQueries[UserContext](graphQL.maxQueryComplexity, (_, _) => new Exception("maxQueryComplexity"))
    )
  )
}