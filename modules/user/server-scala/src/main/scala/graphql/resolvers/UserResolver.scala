package graphql.resolvers

import model._

import scala.concurrent.Future

trait UserResolver {
  def register(registerUserInput: RegisterUserInput, skipConfirmation: Boolean): Future[UserPayload]

  def confirmRegistration(input: ConfirmRegistrationInput): Future[AuthPayload]

  def login(loginUserInput: LoginUserInput): Future[AuthPayload]
}