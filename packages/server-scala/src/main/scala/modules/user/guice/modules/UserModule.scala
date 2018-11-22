package modules.user.guice.modules

import modules.user.graphql.resolvers.{UserResolver, UserResolverImpl}
import modules.user.repositories.{UserRepo, UserRepoImpl}
import net.codingwell.scalaguice.ScalaModule

class UserModule extends ScalaModule {
  override def configure() = {
    bind[UserResolver].to[UserResolverImpl]
    bind[UserRepo].to[UserRepoImpl]
  }
}