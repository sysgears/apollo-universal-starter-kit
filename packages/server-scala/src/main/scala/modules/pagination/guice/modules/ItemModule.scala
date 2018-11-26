package modules.pagination.guice.modules

import akka.actor.Actor
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import modules.pagination.graphql.resolvers.ItemResolver
import modules.pagination.repositories.{ItemRepo, ItemRepoImpl}
import net.codingwell.scalaguice.ScalaModule

class ItemModule extends ScalaModule with GuiceActorRefProvider {

  override def configure() = {
    bind[ItemRepo].to[ItemRepoImpl]
    bind[Actor].annotatedWith(Names.named(ItemResolver.name)).to[ItemResolver]
  }
}
