package guice

import akka.actor.{Actor, ActorRef, ActorSystem}
import com.google.inject.Provides
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import graphql.resolvers._
import javax.inject.Named
import net.codingwell.scalaguice.ScalaModule

class UserBinding extends ScalaModule with GuiceActorRefProvider {

  override def configure() = {
    bind[Actor].annotatedWith(Names.named(UserResolver.name)).to[UserResolver]
  }

  @Provides
  @Named(UserResolver.name)
  def userResolver(implicit actorSystem: ActorSystem): ActorRef = provideActorRef(UserResolver)
}