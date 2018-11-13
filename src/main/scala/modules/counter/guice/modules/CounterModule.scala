package modules.counter.guice.modules

import akka.actor.{Actor, ActorSystem}
import com.google.inject.Provides
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import javax.inject.Named
import modules.counter.graphql.resolvers.CounterResolver
import modules.counter.repositories.{CounterRepo, CounterRepoImpl}
import modules.counter.services.count.CounterActor
import net.codingwell.scalaguice.ScalaModule

class CounterModule extends ScalaModule with GuiceActorRefProvider {

  override def configure() {
    bind[CounterRepo].to[CounterRepoImpl]
    bind[Actor].annotatedWith(Names.named(CounterActor.name)).to[CounterActor]
    bind[Actor].annotatedWith(Names.named(CounterResolver.name)).to[CounterResolver]
  }

  @Provides
  @Named(CounterActor.name)
  def counterActor(implicit actorSystem: ActorSystem) = {
    provideActorRef(CounterActor.name)
  }
}