import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.ScalatestRouteTest
import core.controllers.graphql.GraphQLController
import core.guice.injection.Injecting
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, Matchers, WordSpec}

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait ContactSpecHelper extends WordSpec
  with ScalatestRouteTest
  with BeforeAndAfter
  with BeforeAndAfterAll
  with Injecting
  with Matchers {

  val endpoint: String = "/graphql"
  val routes: Route = inject[GraphQLController].routes

  before {
    clean()
  }

  after {
    clean()
  }

  def clean(): Unit = ()

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}
