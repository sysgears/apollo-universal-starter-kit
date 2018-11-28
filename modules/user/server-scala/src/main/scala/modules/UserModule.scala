package modules

import akka.actor.Actor
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import graphql.resolvers._
import repositories.{UserRepo, UserRepoImpl}
import net.codingwell.scalaguice.ScalaModule
import repositories.UserRepository
import slick.jdbc.JdbcProfile

class UserModule extends ScalaModule with GuiceActorRefProvider {

  override def configure() = {
    bind[UserRepo].to[UserRepoImpl]
    bind[Actor].annotatedWith(Names.named(TokenResolver.name)).to[TokenResolver]
    bind[Actor].annotatedWith(Names.named(UserResolver.name)).to[UserResolver]
  }

  @Provides
  def userRepository(driver: JdbcProfile): Repository[User, Int] = new UserRepository(driver)
}