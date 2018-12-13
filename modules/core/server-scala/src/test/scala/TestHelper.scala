import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.ScalatestRouteTest
import common.shapes.ServerModule
import common.graphql.schema.GraphQL
import core.guice.Injecting
import common.routes.graphql.{GraphQLRoute, HttpHandler, WebSocketHandler}
import modules.session.JWTSessionImpl
import monix.execution.Scheduler
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, Matchers, WordSpec}

trait TestHelper extends WordSpec
  with ScalatestRouteTest
  with BeforeAndAfter
  with BeforeAndAfterAll
  with Matchers
  with Injecting {

  val endpoint: String = "/graphql"
  implicit val scheduler: Scheduler = inject[Scheduler]

  def routesWithGraphQLSchemaFor[T <: ServerModule : Manifest]: Route = {
    val graphQl = new GraphQL(inject[T])
    val httpHandler = new HttpHandler(graphQl)
    val webSocketHandler = new WebSocketHandler(graphQl)
    val graphQLRoute = new GraphQLRoute(httpHandler, inject[JWTSessionImpl], webSocketHandler, graphQl)
    graphQLRoute.routes
  }
}