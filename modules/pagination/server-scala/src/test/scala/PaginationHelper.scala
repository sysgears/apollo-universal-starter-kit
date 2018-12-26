import akka.http.scaladsl.server.Route
import app.PaginationModule
import com.google.inject.Guice
import core.guice.bindings.CoreBinding
import guice.ItemBinding
import net.codingwell.scalaguice.ScalaModule
import repositories.ItemSchemaInitializer
import scala.collection.JavaConverters._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait PaginationHelper extends TestHelper {

  val bindings: Seq[ScalaModule] = Seq(new ItemBinding, new CoreBinding)
  Guice.createInjector(bindings.asJava)
  val routes: Route = routesWithGraphQLSchema(new PaginationModule())
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
    await(paginationInitializer.createAndSeed())
  }

  private def dropDb(): Unit = {
    await(paginationInitializer.drop())
  }

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}