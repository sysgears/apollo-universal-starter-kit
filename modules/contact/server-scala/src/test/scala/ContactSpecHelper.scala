import akka.http.scaladsl.server.Route
import app.ContactModule

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait ContactSpecHelper extends TestHelper {

  val routes: Route = routesWithGraphQLSchema[ContactModule]

  before {
    clean()
  }

  after {
    clean()
  }

  def clean(): Unit = ()

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}
