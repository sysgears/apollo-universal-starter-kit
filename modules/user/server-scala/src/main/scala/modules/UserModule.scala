package modules

import graphql.resolvers.{UserResolver, UserResolverImpl}
import repositories.{UserRepo, UserRepoImpl}
import net.codingwell.scalaguice.ScalaModule

class UserModule extends ScalaModule {
  override def configure() = {
    bind[UserResolver].to[UserResolverImpl]
    bind[UserRepo].to[UserRepoImpl]
  }
}