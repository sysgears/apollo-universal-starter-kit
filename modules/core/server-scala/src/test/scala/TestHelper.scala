import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.ScalatestRouteTest
import com.typesafe.config.ConfigFactory
import common.graphql.schema.GraphQL
import common.routes.graphql.{GraphQLRoute, HttpHandler, WebSocketHandler}
import common.shapes.ServerModule
import core.guice.injection.Injecting
import modules.session.JWTSessionImpl
import monix.execution.Scheduler
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, Matchers, WordSpec}

import scala.collection.JavaConverters._

trait TestHelper extends WordSpec
  with ScalatestRouteTest
  with BeforeAndAfter
  with BeforeAndAfterAll
  with Matchers
  with Injecting {

  private val config = ConfigFactory.load
  private val loadPaths = config.getList("loadPaths").unwrapped.asScala.map(_.toString).toList
  initialize(loadPaths)

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