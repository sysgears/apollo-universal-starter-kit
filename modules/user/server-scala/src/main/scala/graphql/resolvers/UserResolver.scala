package graphql.resolvers

import com.google.inject.Inject
import common.errors.NotFound
import model._
import org.mindrot.jbcrypt.BCrypt
import repositories.{UserProfileRepository, UserRepository}
import common.implicits.RichDBIO._
import common.implicits.RichFuture._

import scala.concurrent.{ExecutionContext, Future}

class UserResolver @Inject()(userRepository: UserRepository, userProfileRepository: UserProfileRepository)(
    implicit executionContext: ExecutionContext
) {

  def addUser(input: AddUserInput): Future[UserPayload] =
    for {
      user <- userRepository.save {
        User(
          username = input.username,
          email = input.email,
          password = BCrypt.hashpw(input.password, BCrypt.gensalt),
          role = input.role,
          isActive = input.isActive.getOrElse(false)
        )
      }.run
      _ <- input.profile.fold(Future.successful(UserProfile())) {
        profile =>
          userProfileRepository.save {
            UserProfile(
              id = user.id,
              firstName = profile.firstName,
              lastName = profile.lastName,
              fullName = profile.firstName.flatMap(firstName => profile.lastName.map(firstName + _))
            )
          }.run
      }
    } yield UserPayload(user = Some(user))

  def editUser(input: EditUserInput): Future[UserPayload] =
    for {
      user <- userRepository.findOne(input.id).run failOnNone NotFound(s"User with id = ${input.id}")
      editedUser <- userRepository.update {
        User(
          id = Some(input.id),
          username = input.username,
          email = input.email,
          password = input.password.map(BCrypt.hashpw(_, BCrypt.gensalt)).getOrElse(user.password),
          role = input.role,
          isActive = input.isActive.getOrElse(user.isActive)
        )
      }.run
      _ <- input.profile.fold(Future.successful(UserProfile())) {
        profile =>
          userProfileRepository.update {
            UserProfile(
              id = Some(input.id),
              firstName = profile.firstName,
              lastName = profile.lastName,
              fullName = profile.firstName.flatMap(firstName => profile.lastName.map(firstName + _))
            )
          }.run
      }
    } yield UserPayload(user = Some(editedUser))

  def deleteUser(id: Int): Future[UserPayload] =
    for {
      user <- userRepository.findOne(id).run failOnNone NotFound(s"User with id = $id")
      deletedUser <- userRepository.delete(user).run
    } yield UserPayload(user = Some(deletedUser))

  def users(orderBy: Option[OrderByUserInput], filter: Option[FilterUserInput]): Future[List[User]] = {
    userRepository.findAll(orderBy, filter).run.map(_.toList)
  }

  def user(id: Int): Future[UserPayload] = userRepository.findOne(id).run.map(user => UserPayload(user))
}
