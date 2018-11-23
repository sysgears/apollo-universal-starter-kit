package modules.user.graphql.resolvers

import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Inject
import common.RichDBIO._
import modules.user.model.{RegisterUserInput, User, UserPayload}
import org.mindrot.jbcrypt.BCrypt

import scala.concurrent.{ExecutionContext, Future}

class UserResolverImpl @Inject()(userRepository: Repository[User, Int])
                                (implicit executionContext: ExecutionContext) extends UserResolver {
  override def register(input: RegisterUserInput): Future[UserPayload] = {

    val hashedPassword = BCrypt.hashpw(input.password, BCrypt.gensalt)
    val user = User(
      username = input.username,
      email = input.email,
      password = hashedPassword
    )
    userRepository.save(user).run.map(createdUser => UserPayload(Some(createdUser)))
  }
}