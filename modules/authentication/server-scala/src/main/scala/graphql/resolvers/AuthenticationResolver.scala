package graphql.resolvers

import java.sql.SQLException

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import com.github.jurajburian.mailer.Message
import com.google.inject.Inject
import common.{ActorNamed, FieldError}
import common.config.AppConfig
import common.errors.{AlreadyExists, NotFound}
import config.{AuthConfig, MailConfig}
import errors.Unauthenticated
import model._
import models.MailPayload
import org.mindrot.jbcrypt.BCrypt
import repositories.UserRepository
import services.{MailService, MessageTemplateService}
import common.implicits.RichDBIO._
import common.implicits.RichFuture._
import common.implicits.RichTry._
import jwt.model.{JwtContent, Tokens}
import jwt.service.JwtAuthService

import scala.concurrent.{ExecutionContext, Future}

object AuthenticationResolver extends ActorNamed {
  final val name = "AuthenticationResolver"
}

class AuthenticationResolver @Inject()(
    userRepository: UserRepository,
    jwtAuthService: JwtAuthService[JwtContent],
    mailService: MailService[Message, MailPayload],
    messageTemplateService: MessageTemplateService,
    mailConfig: MailConfig,
    authConfig: AuthConfig,
    appConfig: AppConfig
)(implicit executionContext: ExecutionContext)
  extends Actor
  with ActorLogging {

  override def receive: Receive = {
    case (input: RegisterUserInput, skipConfirmation: Boolean) => {
      for {
        createdUser <- userRepository
          .save(
            User(
              username = input.username,
              email = input.email,
              role = "user",
              isActive = skipConfirmation,
              password = BCrypt.hashpw(input.password, BCrypt.gensalt)
            )
          )
          .run
        mailingResult <- if (!skipConfirmation) {
          mailService.send(
            messageTemplateService.createConfirmRegistrationMessage(
              createdUser,
              appConfig.name,
              mailConfig.address,
              appConfig.url + "/confirmation/" + jwtAuthService.createAccessToken(JwtContent(createdUser.id.get))
            )
          )
        } else Future.successful(MailPayload())
      } yield UserPayload(Some(createdUser), mailingResult.errors)
    }.recover {
        case e: SQLException =>
          val usernameWarning =
            if (e.getMessage.contains("column USERNAME is not unique"))
              Some(FieldError("username", "Username already exists."))
            else None
          val emailWarning =
            if (e.getMessage.contains("column EMAIL is not unique")) Some(FieldError("email", "E-mail already exists."))
            else None
          UserPayload(errors = Some(List(usernameWarning, emailWarning).flatten))
      }
      .pipeTo(sender)

    case input: ResendConfirmationMessageInput => {
      for {
        user <- userRepository.findByUsernameOrEmail(input.usernameOrEmail).run failOnNone NotFound(
          s"User with username or email: [${input.usernameOrEmail}] not found."
        )
        _ <- if (!user.isActive) Future.successful()
        else Future.failed(AlreadyExists(s"User with id: [${user.id}] is active"))
        _ <- if (BCrypt.checkpw(input.password, user.password)) Future.successful()
        else Future.failed(Unauthenticated())
        accessToken = jwtAuthService.createAccessToken(JwtContent(user.id.get))
        mailingResult <- mailService.send(
          messageTemplateService.createConfirmRegistrationMessage(
            user,
            appConfig.name,
            mailConfig.address,
            appConfig.url + "/confirmation/" + accessToken
          )
        )
      } yield UserPayload(Some(user), mailingResult.errors)
    }.pipeTo(sender)

    case input: LoginUserInput => {
      for {
        user <- userRepository.findByUsernameOrEmail(input.usernameOrEmail).run failOnNone NotFound(
          s"User with username or email: [${input.usernameOrEmail}] not found."
        )
        _ <- if (BCrypt.checkpw(input.password, user.password)) Future.successful()
        else Future.failed(Unauthenticated())
        accessToken = jwtAuthService.createAccessToken(JwtContent(user.id.get))
        refreshToken = jwtAuthService.createRefreshToken(JwtContent(user.id.get), user.password)
      } yield AuthPayload(Some(user), Some(Tokens(accessToken, refreshToken)))
    }.recover {
        case _: NotFound =>
          AuthPayload(errors = Some(FieldError("usernameOrEmail", "Please enter a valid username or e-mail.") :: Nil))
        case _: Unauthenticated =>
          AuthPayload(errors = Some(FieldError("password", "Please enter a valid password.") :: Nil))
      }
      .pipeTo(sender)

    case input: ForgotPasswordInput => {
      for {
        user <- userRepository.findByEmail(input.email).run failOnNone NotFound(
          s"User with username or email: [${input.email}] not found."
        )
        token = jwtAuthService.createAccessToken(JwtContent(user.id.get))
        _ <- mailService.send(
          messageTemplateService.createRecoverPasswordMessage(
            user,
            appConfig.name,
            mailConfig.address,
            appConfig.url + "/reset-password/" + token
          )
        )
      } yield token
    }.pipeTo(sender)

    case input: ResetPasswordInput => {
      if (input.password != input.passwordConfirmation)
        Future.successful(ResetPayload(Some(FieldError("password", "Passwords are not the same.") :: Nil)))
      else if (input.password.length < authConfig.passwordMinLength)
        Future.successful(
          ResetPayload(
            Some(FieldError("password", s"Password length must be more than ${authConfig.passwordMinLength}.") :: Nil)
          )
        )
      else
        for {
          tokenContent <- jwtAuthService.decodeAccessToken(input.token).asFuture
          user <- userRepository.findOne(tokenContent.id).run failOnNone NotFound(
            s"User with id: [${tokenContent.id}] not found."
          )
          _ <- userRepository.update(user.copy(password = BCrypt.hashpw(input.password, BCrypt.gensalt))).run
        } yield ResetPayload()
    }.pipeTo(sender)

    case unknownMessage @ _ => log.warning(s"Received unknown message: $unknownMessage")
  }
}
