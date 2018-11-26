package guice.modules

import akka.actor.Actor
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import graphql.resolvers.ItemResolver
import repositories.{ItemRepo, ItemRepoImpl}
import net.codingwell.scalaguice.ScalaModule

/**
  * Provides dependency injection functionality.
  */
class ItemModule extends ScalaModule with GuiceActorRefProvider {

  override def configure() = {
    bind[ItemRepo].to[ItemRepoImpl]
    bind[Actor].annotatedWith(Names.named(ItemResolver.name)).to[ItemResolver]
  }
}
