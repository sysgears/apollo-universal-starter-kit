import akka.http.scaladsl.server.Route
import app.CounterModule
import repositories.CounterSchemaInitializer

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait CounterSpecHelper extends TestHelper {

  val counterInitializer: CounterSchemaInitializer = inject[CounterSchemaInitializer]
  val routes: Route = routesWithGraphQLSchema[CounterModule]

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