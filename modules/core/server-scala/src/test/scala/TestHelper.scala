import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.ScalatestRouteTest
import common.graphql.UserContext
import common.routes.graphql.{GraphQLRoute, HttpHandler, WebSocketHandler}
import common.slick.SchemaInitializer
import core.guice.injection.InjectorProvider
import monix.execution.Scheduler
import org.scalamock.scalatest.MockFactory
import org.scalatest._
import sangria.execution.{Executor, QueryReducer}
import shapes.ServerModule

trait TestHelper
  extends WordSpec
  with ScalatestRouteTest
  with BeforeAndAfter
  with BeforeAndAfterEach
  with BeforeAndAfterAll
  with Matchers
  with MockFactory {

  val endpoint: String = "/graphql"
  lazy implicit val scheduler: Scheduler = inject[Scheduler]

  def inject[T: Manifest]: T = InjectorProvider.inject[T]

  def routesWithGraphQLSchema(serverModule: ServerModule[UserContext, SchemaInitializer[_]]): Route = {
    val graphQl = new TestGraphQLSchema(serverModule)
    val graphQlExecutor = Executor(
      schema = graphQl.schema,
      queryReducers = List(
        QueryReducer.rejectMaxDepth[UserContext](graphQl.maxQueryDepth),
        QueryReducer
          .rejectComplexQueries[UserContext](graphQl.maxQueryComplexity, (_, _) => new Exception("maxQueryComplexity"))
      )
    )
    val httpHandler = new HttpHandler(graphQl, graphQlExecutor)
    val webSocketHandler = new WebSocketHandler(graphQl, graphQlExecutor)
    val graphQLRoute = new GraphQLRoute(httpHandler, webSocketHandler, graphQl)
    graphQLRoute.routes
  }
}
