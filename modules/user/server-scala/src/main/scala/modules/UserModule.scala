package modules

import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Provides
import graphql.resolvers.{UserResolver, UserResolverImpl}
import model.User
import net.codingwell.scalaguice.ScalaModule
import repositories.UserRepository
import slick.jdbc.JdbcProfile

class UserModule extends ScalaModule {

  override def configure() {
    bind[UserResolver].to[UserResolverImpl]
  }

  @Provides
  def userRepository(driver: JdbcProfile): Repository[User, Int] = new UserRepository(driver)
}