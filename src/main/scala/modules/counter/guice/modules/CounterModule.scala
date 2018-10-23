package modules.counter.guice.modules

import akka.actor.{ActorRef, ActorSystem}
import com.google.inject.name.Named
import com.google.inject.{AbstractModule, Provides, Singleton}
import core.services.persistence.PersistenceCleanup
import modules.counter.services.count.CounterPersistentActor
import net.codingwell.scalaguice.ScalaModule

class CounterModule extends AbstractModule with ScalaModule {

  @Provides
  @Singleton
  @Named(CounterPersistentActor.name)
  def counterActor(actorSystem: ActorSystem, persistenceCleanup: PersistenceCleanup): ActorRef = {
    actorSystem.actorOf(CounterPersistentActor.props(persistenceCleanup))
  }
}