package modules

import akka.actor.ActorSystem
import com.google.inject.AbstractModule
import net.codingwell.scalaguice.ScalaModule

class AkkaModule(implicit actorSystem: ActorSystem) extends AbstractModule with ScalaModule {

  override def configure {
    bind[ActorSystem].toInstance(actorSystem)
  }
}