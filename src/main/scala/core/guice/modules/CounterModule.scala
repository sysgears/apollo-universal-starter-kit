package core.guice.modules

import actors.counter.CounterPersistentActor
import akka.actor.{ActorRef, ActorSystem}
import com.google.inject.name.Named
import com.google.inject.{AbstractModule, Provides, Singleton}
import net.codingwell.scalaguice.ScalaModule
import services.counter.{ActorCounterServiceImpl, CounterService}
import services.persistence.PersistenceCleanup

class CounterModule extends AbstractModule with ScalaModule {

  override def configure() {
    bind[CounterService].to[ActorCounterServiceImpl]
  }

  @Provides
  @Singleton
  @Named(CounterPersistentActor.name)
  def counterActor(actorSystem: ActorSystem, persistenceCleanup: PersistenceCleanup): ActorRef = {
    actorSystem.actorOf(CounterPersistentActor.props(persistenceCleanup))
  }
}