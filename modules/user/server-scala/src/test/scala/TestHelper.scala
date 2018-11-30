import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.ScalatestRouteTest
import core.controllers.graphql.GraphQLController
import core.guice.injection.Injecting
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, Matchers, WordSpec}
import repositories.UserSchemaInitializer

import scala.concurrent.{Await, Future}
import scala.concurrent.duration.Duration

trait TestHelper extends WordSpec
  with ScalatestRouteTest
  with BeforeAndAfter
  with BeforeAndAfterAll
  with Injecting
  with Matchers {

  val endpoint: String = "/graphql"
  val routes: Route = inject[GraphQLController].routes

  val userInitializer: UserSchemaInitializer = inject[UserSchemaInitializer]

  before {
    clean()
    dropDb()
    initDb()
  }

  after {
    dropDb()
    clean()
  }

  def clean(): Unit = ()

  private def initDb(): Unit = {
    await(userInitializer.create())
  }

  private def dropDb(): Unit = {
    await(userInitializer.drop())
  }

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}
