package modules

import akka.actor.Actor
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import graphql.resolvers._
import net.codingwell.scalaguice.ScalaModule
import repositories.{UserRepository, UserRepositoryImpl}

class UserModule extends ScalaModule with GuiceActorRefProvider {

  override def configure() = {
    bind[UserRepository].to[UserRepositoryImpl]
    bind[Actor].annotatedWith(Names.named(TokenResolver.name)).to[TokenResolver]
    bind[Actor].annotatedWith(Names.named(UserResolver.name)).to[UserResolver]
  }
}