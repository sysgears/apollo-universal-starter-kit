package core.guice.bindings

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import net.codingwell.scalaguice.ScalaModule

import scala.concurrent.ExecutionContext

class AkkaBinding extends ScalaModule {

  override def configure() {
    implicit val system: ActorSystem = ActorSystem("scala-starter-kit")
    implicit val dispatcher: ExecutionContext = system.dispatcher
    bind[ActorSystem].toInstance(system)
    bind[ActorMaterializer].toInstance(ActorMaterializer())
    bind[ExecutionContext].toInstance(dispatcher)
  }
}