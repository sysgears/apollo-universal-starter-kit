import com.google.inject.Guice
import core.guice.bindings.CoreBinding
import guice.AuthenticationBinding
import net.codingwell.scalaguice.ScalaModule

import scala.collection.JavaConverters._
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

trait AuthenticationTestHelper extends TestHelper {

  val bindings: Seq[ScalaModule] = Seq(new CoreBinding, new AuthenticationBinding)
  Guice.createInjector(bindings.asJava)

  def await[T](asyncFunc: => Future[T]): T = Await.result[T](asyncFunc, Duration.Inf)
}
