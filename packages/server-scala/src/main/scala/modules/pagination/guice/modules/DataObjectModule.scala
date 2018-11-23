package modules.pagination.guice.modules

import akka.actor.Actor
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import modules.pagination.graphql.resolvers.DataObjectResolver
import modules.pagination.repositories.{DataObjectRepo, DataObjectRepoImpl}
import net.codingwell.scalaguice.ScalaModule

class DataObjectModule extends ScalaModule with GuiceActorRefProvider {

  override def configure() = {
    bind[DataObjectRepo].to[DataObjectRepoImpl]
    bind[Actor].annotatedWith(Names.named(DataObjectResolver.name)).to[DataObjectResolver]
  }
}
