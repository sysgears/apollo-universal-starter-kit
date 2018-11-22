package modules.user.guice.modules

import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Provides
import modules.user.graphql.resolvers.{UserResolver, UserResolverImpl}
import modules.user.model.User
import modules.user.repositories.UserRepository
import net.codingwell.scalaguice.ScalaModule
import slick.jdbc.JdbcProfile

class UserModule extends ScalaModule {

  override def configure() {
    bind[UserResolver].to[UserResolverImpl]
  }

  @Provides
  def userRepository(driver: JdbcProfile): Repository[User, Int] = new UserRepository(driver)
}