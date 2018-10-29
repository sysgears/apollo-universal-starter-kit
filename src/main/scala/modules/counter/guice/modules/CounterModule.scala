package modules.counter.guice.modules

import akka.actor.{Actor, ActorSystem}
import com.google.inject.Provides
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import javax.inject.Named
import modules.counter.repositories.{CounterRepo, CounterRepoImpl}
import modules.counter.services.count.CounterActor
import net.codingwell.scalaguice.ScalaModule

class CounterModule extends ScalaModule with GuiceActorRefProvider {

  override def configure() {
    bind[CounterRepo].to[CounterRepoImpl]
    bind[Actor].annotatedWith(Names.named(CounterActor.name)).to[CounterActor]
  }

  @Provides
  @Named(CounterActor.name)
  def actor(actorSystem: ActorSystem) = {
    provideActorRef(actorSystem, CounterActor.name)
  }
}