package graphql.resolvers

import model._

import scala.concurrent.Future

trait UserResolver {
  def register(registerUserInput: RegisterUserInput, skipConfirmation: Boolean): Future[UserPayload]

  def confirmRegistration(input: ConfirmRegistrationInput): Future[AuthPayload]

  def resendConfirmationMessage(input: ResendConfirmationMessageInput): Future[UserPayload]

  def login(loginUserInput: LoginUserInput): Future[AuthPayload]

  def forgotPassword(input: ForgotPasswordInput): Future[String]

  def resetPassword(input: ResetPasswordInput): Future[ResetPayload]
}