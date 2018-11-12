package modules.user.guice.modules

import modules.user.repositories.{UserRepo, UserRepoImpl}
import net.codingwell.scalaguice.ScalaModule

class UserModule extends ScalaModule {
  override def configure() = {
    bind[UserRepo].to[UserRepoImpl]
  }
}