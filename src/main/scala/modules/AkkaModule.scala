package modules

import akka.actor.ActorSystem
import com.google.inject.{AbstractModule, Provides}
import net.codingwell.scalaguice.ScalaModule

class AkkaModule extends AbstractModule with ScalaModule {

  @Provides
  def actorSystem: ActorSystem = {
    ActorSystem("scala-starter-kit")
  }
}