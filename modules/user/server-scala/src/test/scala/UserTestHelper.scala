import akka.http.scaladsl.server.Route
import app.UserModule
import repositories.UserSchemaInitializer

import scala.concurrent.{Await, Future}
import scala.concurrent.duration.Duration

trait UserTestHelper extends TestHelper {

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
    await(userInitializer.create())
  }

  private def dropDb(): Unit = {
    await(userInitializer.drop())
  }

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}
