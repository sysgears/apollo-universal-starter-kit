package modules

import actors.counter.CountingActor
import akka.actor.{ActorRef, ActorSystem, Props}
import com.google.inject.name.Named
import com.google.inject.{AbstractModule, Provides, Singleton}
import com.typesafe.config.Config
import net.codingwell.scalaguice.ScalaModule
import services.counter.{ActorCountingServiceImpl, CountingService}

class CountingModule extends AbstractModule with ScalaModule {

  override def configure() {
    bind[CountingService].to[ActorCountingServiceImpl]
  }

  @Provides
  @Singleton
  @Named(CountingActor.name)
  def countingActor(actorSystem: ActorSystem, config: Config): ActorRef = {
    actorSystem.actorOf(Props(new CountingActor(config)))
  }
}