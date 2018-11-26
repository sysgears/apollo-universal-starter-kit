package core.controllers.graphql

import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.ScalatestRouteTest
import core.guice.injection.Injecting
import modules.counter.repositories.CounterSchemaInitializer
//import repositories.UserSchemaInitializer
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, Matchers, WordSpec}
//import guice.modules.upload.repositories.FileSchemaInitializer

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

  val counterInitializer: CounterSchemaInitializer = inject[CounterSchemaInitializer]

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
    await(counterInitializer.create())
  }

  private def dropDb(): Unit = {
    await(counterInitializer.drop())
  }

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}