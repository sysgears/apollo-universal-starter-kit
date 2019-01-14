import akka.http.scaladsl.server.Route
import app.UploadModule
import com.google.inject.Guice
import core.guice.bindings.CoreBinding
import guice.FileBinding
import net.codingwell.scalaguice.ScalaModule
import repositories.FileSchemaInitializer
import scala.collection.JavaConverters._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait UploadHelper extends TestHelper {

  val bindings: Seq[ScalaModule] = Seq(new CoreBinding, new FileBinding)
  Guice.createInjector(bindings.asJava)
  val routes: Route = routesWithGraphQLSchema(new UploadModule())

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
