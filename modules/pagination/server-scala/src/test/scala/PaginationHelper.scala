import akka.http.scaladsl.server.Route
import app.PaginationModule
import repositories.ItemSchemaInitializer

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait PaginationHelper extends TestHelper {

  val routes: Route = routesWithGraphQLSchemaFor[PaginationModule]
  val paginationInitializer: ItemSchemaInitializer = inject[ItemSchemaInitializer]

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
    await(paginationInitializer.create())
  }

  private def dropDb(): Unit = {
    await(paginationInitializer.drop())
  }

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}