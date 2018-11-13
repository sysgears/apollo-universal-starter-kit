package core.controllers.graphql

import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.ScalatestRouteTest
import core.guice.injection.Injecting
import modules.counter.repositories.CounterSchemaInitializer
import modules.upload.repositories.FileSchemaInitializer
import org.scalatest._

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

  val initializer: CounterSchemaInitializer = inject[CounterSchemaInitializer]
  val fileInitializer: FileSchemaInitializer = inject[FileSchemaInitializer]

  before {
    await(initializer.drop())
    await(fileInitializer.drop())
    await(initializer.create())
    await(fileInitializer.create())
  }

  after {
    await(initializer.drop())
    await(fileInitializer.drop())
  }

  override def afterAll(): Unit = {
    await(initializer.drop())
    await(fileInitializer.drop())
  }

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}