import akka.http.scaladsl.server.Route
import app.ContactModule
import com.google.inject.Guice
import core.guice.bindings.CoreBinding
import guice.{ContactBinding, MailBinding}
import net.codingwell.scalaguice.ScalaModule
import scala.collection.JavaConverters._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait ContactSpecHelper extends TestHelper {

  val bindings: Seq[ScalaModule] = Seq(new ContactBinding, new CoreBinding, new MailBinding)
  Guice.createInjector(bindings.asJava)
  val routes: Route = routesWithGraphQLSchema(new ContactModule())

  before {
    clean()
  }

  after {
    clean()
  }

  def clean(): Unit = ()

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}
