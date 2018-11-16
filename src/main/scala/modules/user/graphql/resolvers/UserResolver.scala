package modules.user.graphql.resolvers

import modules.user.model.{RegisterUserInput, UserPayload}

import scala.concurrent.Future

trait UserResolver {

  def register(registerUserInput: RegisterUserInput): Future[UserPayload]
}