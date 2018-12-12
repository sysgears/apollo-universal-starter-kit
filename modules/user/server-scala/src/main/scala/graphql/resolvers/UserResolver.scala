package graphql.resolvers

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import com.github.jurajburian.mailer.Message
import com.google.inject.Inject
import common.ActorNamed
import common.config.AppConfig
import common.errors.{AlreadyExists, NotFound}
import common.implicits.RichDBIO._
import common.implicits.RichFuture._
import common.implicits.RichTry._
import config.{AuthConfig, MailConfig}
import errors.Unauthenticated
import model._
import models.MailPayload
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import org.mindrot.jbcrypt.BCrypt
import repositories.UserRepository
import services.MailService
import services.MessageTemplateService

import scala.concurrent.{ExecutionContext, Future}

object UserResolver extends ActorNamed {
  final val name = "UserResolver"
}

class UserResolver @Inject()(userRepository: UserRepository,
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
        createdUser <- userRepository.save(
          User(
            username = input.username,
            email = input.email,
            role = "user",
            isActive = skipConfirmation,
            password = BCrypt.hashpw(input.password, BCrypt.gensalt)
          )).run
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
        tokenContent <- jwtAuthService.decodeContent(input.token).asFuture
        user <- userRepository.findOne(tokenContent.id).run failOnNone NotFound(s"User with id: [${tokenContent.id}] not found.")
        activeUser <- if (!user.isActive) userRepository.update(user.copy(isActive = true)).run else Future.failed(AlreadyExists(s"User with id: [${user.id}] is active"))
        userId <- Future.successful(activeUser.id) failOnNone NotFound(s"Id for user: [${activeUser.username}] is none.")
        accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
        refreshToken = jwtAuthService.createRefreshToken(JwtContent(userId), user.password)
      } yield AuthPayload(Some(activeUser), Some(Tokens(accessToken, refreshToken)))
    }.pipeTo(sender)

    case input: ResendConfirmationMessageInput => {
      for {
        user <- userRepository.findOne(input.usernameOrEmail).run failOnNone NotFound(s"User with username or email: [${input.usernameOrEmail}] not found.")
        _ <- if (!user.isActive) Future.successful() else Future.failed(AlreadyExists(s"User with id: [${user.id}] is active"))
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
        user <- userRepository.findOne(input.usernameOrEmail).run failOnNone NotFound(s"User with username or email: [${input.usernameOrEmail}] not found.")
        _ <- if (BCrypt.checkpw(input.password, user.password)) Future.successful() else Future.failed(Unauthenticated())
        userId <- Future.successful(user.id) failOnNone NotFound(s"Id for user: [${input.usernameOrEmail}] is none.")
        accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
        refreshToken = jwtAuthService.createRefreshToken(JwtContent(userId), user.password)
      } yield AuthPayload(Some(user), Some(Tokens(accessToken, refreshToken)))
    }.pipeTo(sender)

    case input: ForgotPasswordInput => {
      for {
        user <- userRepository.findOne(input.usernameOrEmail).run failOnNone NotFound(s"User with username or email: [${input.usernameOrEmail}] not found.")
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
        tokenContent <- jwtAuthService.decodeAccessToken(input.token).asFuture
        user <- userRepository.findOne(tokenContent.id).run failOnNone NotFound(s"User with id: [${tokenContent.id}] not found.")
        _ <- userRepository.update(user.copy(password = BCrypt.hashpw(input.password, BCrypt.gensalt))).run
      } yield ResetPayload()
    }.pipeTo(sender)

    case unknownMessage@_ => log.warning(s"Received unknown message: $unknownMessage")
  }
}