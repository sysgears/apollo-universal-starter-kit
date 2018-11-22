package core.controllers.graphql

import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.ScalatestRouteTest
import core.guice.injection.Injecting
import modules.counter.repositories.CounterSchemaInitializer
import modules.pagination.repositories.DataObjectSchemaInitializer
import modules.user.repositories.UserSchemaInitializer
import org.scalatest.{BeforeAndAfter, BeforeAndAfterAll, Matchers, WordSpec}
import modules.upload.repositories.FileSchemaInitializer

import scala.concurrent.{Await, Future}
import scala.concurrent.duration.Duration

trait TestHelper extends WordSpec
  with ScalatestRouteTest
  with BeforeAndAfter
  with BeforeAndAfterAll
  with Injecting
  with Matchers
  with LazyAppComponents {

  val endpoint: String = "/graphql"
  val routes: Route = inject[GraphQLController].routes

  val counterInitializer: CounterSchemaInitializer = inject[CounterSchemaInitializer]
  val userInitializer: UserSchemaInitializer = inject[UserSchemaInitializer]
  val fileInitializer: FileSchemaInitializer = inject[FileSchemaInitializer]
  val dataObjectInitializer: DataObjectSchemaInitializer = inject[DataObjectSchemaInitializer]

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
    await(userInitializer.create())
    await(fileInitializer.create())
    await(dataObjectInitializer.create())
  }

  private def dropDb(): Unit = {
    await(counterInitializer.drop())
    await(userInitializer.drop())
    await(fileInitializer.drop())
    await(dataObjectInitializer.drop())
  }

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}