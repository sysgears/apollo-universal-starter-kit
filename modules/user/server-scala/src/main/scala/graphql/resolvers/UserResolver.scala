package graphql.resolvers

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import com.github.jurajburian.mailer.Message
import com.google.inject.Inject
import common.ActorNamed
import common.config.AppConfig
import common.errors.NotFound
import config.AuthConfig
import model._
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import modules.mail.config.MailConfig
import modules.mail.models.MailPayload
import modules.mail.services.MailService
import org.mindrot.jbcrypt.BCrypt
import repositories.UserRepo
import services.MessageTemplateService
import common.implicits.RichFuture._
import common.implicits.RichTry._
import errors.Unauthenticated
import modules.jwt.errors.InvalidToken

import scala.concurrent.{ExecutionContext, Future}

object UserResolver extends ActorNamed {
  final val name = "UserResolver"
}

class UserResolver @Inject()(userRepo: UserRepo,
                             jwtAuthService: JwtAuthService[JwtContent],
                             mailService: MailService[Message, MailPayload],
                             messageTemplateService: MessageTemplateService,
                             mailConfig: MailConfig,
                             authConfig: AuthConfig,
                             appConfig: AppConfig)
                            (implicit executionContext: ExecutionContext) extends Actor
  with ActorLogging {

  override def receive: Receive = {
    case (input: RegisterUserInput, skipConfirmation: Boolean) => {
      for {
        createdUser <- userRepo.save(
          User(
            username = input.username,
            email = input.email,
            role = "user",
            isActive = skipConfirmation,
            password = BCrypt.hashpw(input.password, BCrypt.gensalt)
          ))
        userId <- Future.successful(createdUser.id) failOnNone NotFound(s"Id for user: [${createdUser.username}] is none.")
        accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
        mailingResult <- if (!skipConfirmation) {
          mailService.send(
            messageTemplateService.createConfirmRegistrationMessage(
              createdUser,
              appConfig.name,
              mailConfig.address,
              appConfig.url + authConfig.confirmRegistrationRoute + accessToken)
          )
        } else Future.successful(MailPayload())
      } yield UserPayload(Some(createdUser), mailingResult.errors)
    }.pipeTo(sender)

    case input: ConfirmRegistrationInput => {
      for {
        tokenContent <- jwtAuthService.decodeContent(input.token) asFuture (e => InvalidToken(e.getMessage))
        user <- userRepo.find(tokenContent.id) failOnNone NotFound(s"User with id: [${tokenContent.id}] not found.")
        activeUser <- userRepo.update(user.copy(isActive = true))
        userId <- Future.successful(activeUser.id) failOnNone NotFound(s"Id for user: [${activeUser.username}] is none.")
        accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
        refreshToken = jwtAuthService.createRefreshToken(JwtContent(userId), user.password)
      } yield AuthPayload(Some(user), Some(Tokens(accessToken, refreshToken)))
    }.pipeTo(sender)

    case input: ResendConfirmationMessageInput => {
      for {
        user <- userRepo.find(input.usernameOrEmail) failOnNone NotFound(s"User with username or email: [${input.usernameOrEmail}] not found.")
        _ <- if (BCrypt.checkpw(input.password, user.password)) Future.successful() else Future.failed(Unauthenticated())
        userId <- Future.successful(user.id) failOnNone NotFound(s"Id for user: [${user.username}] is none.")
        accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
        mailingResult <- mailService.send(
          messageTemplateService.createConfirmRegistrationMessage(
            user,
            appConfig.name,
            mailConfig.address,
            appConfig.url + authConfig.confirmRegistrationRoute + accessToken)
        )
      } yield UserPayload(Some(user), mailingResult.errors)
    }.pipeTo(sender)

    case input: LoginUserInput => {
      for {
        user <- userRepo.find(input.usernameOrEmail) failOnNone NotFound(s"User with username or email: [${input.usernameOrEmail}] not found.")
        _ <- if (BCrypt.checkpw(input.password, user.password)) Future.successful() else Future.failed(Unauthenticated())
        userId <- Future.successful(user.id) failOnNone NotFound(s"Id for user: [${input.usernameOrEmail}] is none.")
        accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
        refreshToken = jwtAuthService.createRefreshToken(JwtContent(userId), user.password)
      } yield AuthPayload(Some(user), Some(Tokens(accessToken, refreshToken)))
    }.pipeTo(sender)

    case input: ForgotPasswordInput => {
      for {
        user <- userRepo.find(input.usernameOrEmail) failOnNone NotFound(s"User with username or email: [${input.usernameOrEmail}] not found.")
        userId <- Future.successful(user.id) failOnNone NotFound(s"Id for user: [${input.usernameOrEmail}] is none.")
        token = jwtAuthService.createAccessToken(JwtContent(userId))
        _ <- mailService.send(
          messageTemplateService.createRecoverPasswordMessage(
            user,
            appConfig.name,
            mailConfig.address,
            appConfig.url + authConfig.confirmRegistrationRoute + token)
        )
      } yield token
    }.pipeTo(sender)

    case input: ResetPasswordInput => {
      for {
        tokenContent <- jwtAuthService.decodeContent(input.token) asFuture (e => InvalidToken(e.getMessage))
        user <- userRepo.find(tokenContent.id) failOnNone NotFound(s"User with id: [${tokenContent.id}] not found.")
        _ <- userRepo.update(user.copy(password = BCrypt.hashpw(input.password, BCrypt.gensalt)))
      } yield ResetPayload()
    }.pipeTo(sender)
  }
}