package modules

import actors.counter.CounterActor
import akka.actor.{ActorRef, ActorSystem}
import com.google.inject.name.Named
import com.google.inject.{AbstractModule, Provides, Singleton}
import models.counter.Counter
import net.codingwell.scalaguice.ScalaModule
import services.counter.{ActorCounterServiceImpl, CounterService}

class CounterModule extends AbstractModule with ScalaModule {

  override def configure() {
    bind[CounterService].to[ActorCounterServiceImpl]
    bind[Counter.type].toInstance(Counter)
  }

  @Provides
  @Singleton
  @Named(CounterActor.name)
  def counterActor(actorSystem: ActorSystem): ActorRef = {
    actorSystem.actorOf(CounterActor.props)
  }
}