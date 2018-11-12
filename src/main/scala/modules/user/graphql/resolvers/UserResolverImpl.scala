package modules.user.graphql.resolvers

import com.google.inject.Inject
import modules.user.model.{RegisterUserInput, User, UserPayload}
import modules.user.repositories.UserRepo

import scala.concurrent.{ExecutionContext, Future}

class UserResolverImpl @Inject()(userRepo: UserRepo)
                                (implicit executionContext: ExecutionContext) extends UserResolver {
  override def register(input: RegisterUserInput): Future[UserPayload] = {
    val user = User(
      username = input.username,
      email = input.email,
      password = input.password
    )
    userRepo.save(user).map(createdUser => UserPayload(Some(createdUser)))
  }
}