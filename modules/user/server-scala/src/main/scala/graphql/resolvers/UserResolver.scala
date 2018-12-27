package graphql.resolvers

import com.google.inject.Inject
import model.{AddUserInput, User, UserPayload, UserProfile}
import org.mindrot.jbcrypt.BCrypt
import repositories.{UserProfileRepository, UserRepository}
import common.implicits.RichDBIO._

import scala.concurrent.{ExecutionContext, Future}

class UserResolver @Inject()(userRepository: UserRepository,
                             userProfileRepository: UserProfileRepository)
                            (implicit executionContext: ExecutionContext) {

  def addUser(input: AddUserInput): Future[UserPayload] = for {
    user <- userRepository.save(User(
      username = input.username,
      email = input.email,
      password = BCrypt.hashpw(input.password, BCrypt.gensalt),
      role = input.role,
      isActive = input.isActive.getOrElse(false)
    )).run
    _ <- input.profile.map(
      profile =>
        userProfileRepository.save(UserProfile(
          firstName = profile.firstName,
          lastName = profile.lastName,
          fullName = None
        ).withId(user.id.get)).run
    ).getOrElse(Future.successful())
  } yield UserPayload(user = Some(user))
}