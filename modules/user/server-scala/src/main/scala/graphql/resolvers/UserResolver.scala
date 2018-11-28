package graphql.resolvers

import model.{RegisterUserInput, UserPayload}

import scala.concurrent.Future

trait UserResolver {

  def register(registerUserInput: RegisterUserInput): Future[UserPayload]
}