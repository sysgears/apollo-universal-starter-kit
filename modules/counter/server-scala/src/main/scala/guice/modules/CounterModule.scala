package guice.modules

import akka.actor.{Actor, ActorRef, ActorSystem}
import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Provides
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import graphql.resolvers.CounterResolver
import javax.inject.Named
import models.Counter
import net.codingwell.scalaguice.ScalaModule
import repositories.CounterRepository
import services.count.CounterActor
import slick.jdbc.JdbcProfile

class CounterModule extends ScalaModule with GuiceActorRefProvider {

  override def configure() {
    bind[Actor].annotatedWith(Names.named(CounterActor.name)).to[CounterActor]
    bind[Actor].annotatedWith(Names.named(CounterResolver.name)).to[CounterResolver]
  }

  @Provides
  def counterRepository(driver: JdbcProfile): Repository[Counter, Int] = new CounterRepository(driver)

  @Provides
  @Named(CounterActor.name)
  def counterActor(implicit actorSystem: ActorSystem): ActorRef = provideActorRef(CounterActor)
}