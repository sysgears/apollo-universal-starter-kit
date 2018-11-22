package modules.contact.guice.modules

import akka.actor.{Actor, ActorRef, ActorSystem}
import com.google.inject.Provides
import com.google.inject.name.{Named, Names}
import core.guice.injection.GuiceActorRefProvider
import modules.contact.actor.ContactActor
import modules.contact.graphql.resolvers.{ContactResolver, ContactResolverImpl}
import net.codingwell.scalaguice.ScalaModule

class ContactModule extends ScalaModule with GuiceActorRefProvider {

  override def configure(): Unit = {
    bind[Actor].annotatedWith(Names.named(ContactActor.name)).to[ContactActor]
    bind[ContactResolver].to[ContactResolverImpl]
  }

  @Provides
  @Named(ContactActor.name)
  def actor(implicit actorSystem: ActorSystem): ActorRef = provideActorRef(ContactActor)
}