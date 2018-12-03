package modules

import akka.actor.Actor
import com.google.inject.name.Names
import graphql.resolvers.TokenResolver
import net.codingwell.scalaguice.ScalaModule

class TokenModule extends ScalaModule {

  override def configure() = {
    bind[Actor].annotatedWith(Names.named(TokenResolver.name)).to[TokenResolver]
  }
}