import akka.http.scaladsl.server.Route
import app.CounterModule
import com.google.inject.Guice
import core.guice.bindings.CoreBinding
import guice.CounterBinding
import net.codingwell.scalaguice.ScalaModule
import repositories.CounterSchemaInitializer

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}
import scala.collection.JavaConverters._

trait CounterSpecHelper extends TestHelper {

  val bindings: Seq[ScalaModule] = Seq(new CounterBinding, new CoreBinding)
  Guice.createInjector(bindings.asJava)
  val counterInitializer: CounterSchemaInitializer = inject[CounterSchemaInitializer]
  val routes: Route = routesWithGraphQLSchema(new CounterModule())

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
    await(counterInitializer.createAndSeed())
  }

  private def dropDb(): Unit = {
    await(counterInitializer.drop())
  }

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}