package modules

import actors.counter.CountingActor
import akka.actor.{ActorRef, ActorSystem}
import com.google.inject.name.Named
import com.google.inject.{AbstractModule, Provides, Singleton}
import net.codingwell.scalaguice.ScalaModule
import services.counter.{ActorCountingServiceImpl, CountingService}

class CountingModule extends AbstractModule with ScalaModule {

  override def configure() {
    bind[CountingService].to[ActorCountingServiceImpl]
  }

  @Provides
  @Singleton
  @Named(CountingActor.name)
  def countingActor(actorSystem: ActorSystem): ActorRef = {
    actorSystem.actorOf(CountingActor.props)
  }
}