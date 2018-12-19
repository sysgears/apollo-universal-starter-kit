import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.ScalatestRouteTest
import com.google.inject.Guice
import com.typesafe.config.ConfigFactory
import common.graphql.UserContext
import common.routes.graphql.{GraphQLRoute, HttpHandler, WebSocketHandler}
import common.shapes.ServerModule
import core.guice.injection.InjectorProvider
import core.loader.{ModuleFinder, ScalaModuleFinder}
import modules.session.JWTSessionImpl
import monix.execution.Scheduler
import org.scalamock.scalatest.MockFactory
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, Matchers, WordSpec}
import sangria.execution.{Executor, QueryReducer}

import scala.collection.JavaConverters._

trait TestHelper extends WordSpec
  with ScalatestRouteTest
  with BeforeAndAfter
  with BeforeAndAfterAll
  with Matchers
  with MockFactory {

  private val config = ConfigFactory.load
  private val loadPaths = config.getList("loadPaths").unwrapped.asScala.map(_.toString).toList

  val moduleFinder = ModuleFinder(loadPaths)
  val scalaModuleFinder = ScalaModuleFinder(moduleFinder)
  Guice.createInjector(scalaModuleFinder.scalaModules.asJava)

  val endpoint: String = "/graphql"
  implicit val scheduler: Scheduler = inject[Scheduler]

  def inject[T: Manifest]: T = InjectorProvider.inject[T]

  def routesWithGraphQLSchema[T <: ServerModule : Manifest]: Route = {
    val graphQl = new TestGraphQLSchema(inject[T])
    val graphQlExecutor = Executor(
      schema = graphQl.schema,
      queryReducers = List(
        QueryReducer.rejectMaxDepth[UserContext](graphQl.maxQueryDepth),
        QueryReducer.rejectComplexQueries[UserContext](graphQl.maxQueryComplexity, (_, _) => new Exception("maxQueryComplexity"))
      )
    )
    val httpHandler = new HttpHandler(graphQl, graphQlExecutor)
    val webSocketHandler = new WebSocketHandler(graphQl, graphQlExecutor)
    val graphQLRoute = new GraphQLRoute(httpHandler, inject[JWTSessionImpl], webSocketHandler, graphQl)
    graphQLRoute.routes
  }
}