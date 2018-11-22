package modules.pagination.guice.modules

import akka.actor.{Actor, ActorRef, ActorSystem}
import com.google.inject.Provides
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import javax.inject.Named
import modules.pagination.actor.DataObjectActor
import modules.pagination.graphql.resolvers.DataObjectResolver
import modules.pagination.repositories.{DataObjectRepo, DataObjectRepoImpl}
import net.codingwell.scalaguice.ScalaModule

class DataObjectModule extends ScalaModule with GuiceActorRefProvider {

  override def configure() = {
    bind[DataObjectRepo].to[DataObjectRepoImpl]
    bind[Actor].annotatedWith(Names.named(DataObjectActor.name)).to[DataObjectActor]
    bind[Actor].annotatedWith(Names.named(DataObjectResolver.name)).to[DataObjectResolver]
  }

  @Provides
  @Named(DataObjectActor.name)
  def dataObjectActor(implicit actorSystem: ActorSystem): ActorRef = provideActorRef(DataObjectActor)
}
