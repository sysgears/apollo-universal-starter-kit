package modules

import akka.actor.Actor
import com.google.inject.name.Names
import graphql.interceptors.UserInterceptor
import graphql.resolvers._
import net.codingwell.scalaguice.ScalaModule
import repositories.{UserRepository, UserRepositoryImpl}

class UserModule extends ScalaModule {

  override def configure() = {
    bind[UserRepository].to[UserRepositoryImpl]
    bind[Actor].annotatedWith(Names.named(UserResolver.name)).to[UserResolver]
    bind[Actor].annotatedWith(Names.named(UserInterceptor.name)).to[UserInterceptor]
  }
}