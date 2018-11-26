package graphql.resolvers

import com.google.inject.Inject
import model.{RegisterUserInput, User, UserPayload}
import repositories.UserRepo
import org.mindrot.jbcrypt.BCrypt

import scala.concurrent.{ExecutionContext, Future}

class UserResolverImpl @Inject()(userRepo: UserRepo)
                                (implicit executionContext: ExecutionContext) extends UserResolver {
  override def register(input: RegisterUserInput): Future[UserPayload] = {

    val hashedPassword = BCrypt.hashpw(input.password, BCrypt.gensalt)
    val user = User(
      username = input.username,
      email = input.email,
      password = hashedPassword
    )
    userRepo.save(user).map(createdUser => UserPayload(Some(createdUser)))
  }
}