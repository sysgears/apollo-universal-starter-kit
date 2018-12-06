import akka.http.scaladsl.server.Route
import app.UploadModule
import repositories.FileSchemaInitializer

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait UploadHelper extends TestHelper {

  val routes: Route = routesWithGraphQLSchemaFor[UploadModule]

  val fileInitializer: FileSchemaInitializer = inject[FileSchemaInitializer]

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
    await(fileInitializer.create())
  }

  private def dropDb(): Unit = {
    await(fileInitializer.drop())
  }

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}