import akka.http.scaladsl.server.Route
import app.UserModule
import com.google.inject.Guice
import core.guice.bindings.CoreBinding
import net.codingwell.scalaguice.ScalaModule
import repositories.UserSchemaInitializer

import scala.collection.JavaConverters._

import scala.concurrent.{Await, Future}
import scala.concurrent.duration.Duration

trait UserTestHelper extends TestHelper {

  val bindings: Seq[ScalaModule] = Seq(new CoreBinding)
  Guice.createInjector(bindings.asJava)

  val userInitializer: UserSchemaInitializer = inject[UserSchemaInitializer]
  val routes: Route = routesWithGraphQLSchema(new UserModule())

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
    await(userInitializer.createAndSeed())
  }

  private def dropDb(): Unit = {
    await(userInitializer.drop())
  }

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}
