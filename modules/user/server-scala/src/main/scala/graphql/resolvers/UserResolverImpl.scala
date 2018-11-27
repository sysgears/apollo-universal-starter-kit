package graphql.resolvers

import com.github.jurajburian.mailer.Message
import com.google.inject.Inject
import model._
import repositories.UserRepo
import common.config.AppConfig
import common.errors.NotFound
import common.implicits.RichFuture._
import common.implicits.RichTry._
import config.AuthConfig
import errors.Unauthenticated
import modules.jwt.errors.InvalidToken
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import modules.mail.config.MailConfig
import modules.mail.models.MailPayload
import modules.mail.services.MailService
import org.mindrot.jbcrypt.BCrypt
import services.MessageTemplateService

import scala.concurrent.{ExecutionContext, Future}

class UserResolverImpl @Inject()(userRepo: UserRepo,
                                 jwtAuthService: JwtAuthService[JwtContent],
                                 mailService: MailService[Message, MailPayload],
                                 messageTemplateService: MessageTemplateService,
                                 mailConfig: MailConfig,
                                 authConfig: AuthConfig,
                                 appConfig: AppConfig)
                                (implicit executionContext: ExecutionContext) extends UserResolver {

  override def register(input: RegisterUserInput,
                        skipConfirmation: Boolean = authConfig.skipConfirmation): Future[UserPayload] = for {
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

  override def confirmRegistration(input: ConfirmRegistrationInput): Future[AuthPayload] = for {
    tokenContent <- jwtAuthService.decodeContent(input.token) asFuture (e => InvalidToken(e.getMessage))
    user <- userRepo.find(tokenContent.id) failOnNone NotFound(s"User with id: [${tokenContent.id}] not found.")
    activeUser <- userRepo.update(user.copy(isActive = true))
    userId <- Future.successful(activeUser.id) failOnNone NotFound(s"Id for user: [${activeUser.username}] is none.")
    accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
    refreshToken = jwtAuthService.createRefreshToken(JwtContent(userId), user.password)
  } yield AuthPayload(Some(user), Some(Tokens(accessToken, refreshToken)))

  override def resendConfirmationMessage(input: ResendConfirmationMessageInput): Future[UserPayload] = for {
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

  override def login(input: LoginUserInput): Future[AuthPayload] = for {
    user <- userRepo.find(input.usernameOrEmail) failOnNone NotFound(s"User with username or email: [${input.usernameOrEmail}] not found.")
    _ <- if (BCrypt.checkpw(input.password, user.password)) Future.successful() else Future.failed(Unauthenticated())
    userId <- Future.successful(user.id) failOnNone NotFound(s"Id for user: [${input.usernameOrEmail}] is none.")
    accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
    refreshToken = jwtAuthService.createRefreshToken(JwtContent(userId), user.password)
  } yield AuthPayload(Some(user), Some(Tokens(accessToken, refreshToken)))

  override def forgotPassword(input: ForgotPasswordInput): Future[String] = for {
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
}