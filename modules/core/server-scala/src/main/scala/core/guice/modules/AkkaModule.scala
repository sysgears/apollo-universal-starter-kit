package core.guice.modules

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import com.google.inject.matcher.Matchers
import core.interceptor.{InjectInterceptor, InterceptorService}
import net.codingwell.scalaguice.ScalaModule

import scala.concurrent.ExecutionContext

class AkkaModule extends ScalaModule {

  override def configure() {
    implicit val system: ActorSystem = ActorSystem("scala-starter-kit")
    implicit val dispatcher: ExecutionContext = system.dispatcher
    bind[ActorSystem].toInstance(system)
    bind[ActorMaterializer].toInstance(ActorMaterializer())
    bind[ExecutionContext].toInstance(dispatcher)
    bindInterceptor(Matchers.any(), Matchers.annotatedWith(classOf[InjectInterceptor]), new InterceptorService())
  }
}