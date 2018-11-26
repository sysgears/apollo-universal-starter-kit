package graphql.resolvers

import com.github.jurajburian.mailer.{Content, Message}
import com.google.inject.Inject
import model._
import repositories.UserRepo
import common.config.WebsiteConfig
import common.errors.NotFound
import common.implicits.RichFuture._
import common.implicits.RichOption._
import common.implicits.RichTry._
import config.AuthConfig
import errors.Unauthenticated
import javax.mail.internet.InternetAddress
import modules.jwt.errors.InvalidToken
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import modules.mail.config.MailConfig
import modules.mail.models.MailPayload
import modules.mail.service.MailService
import org.mindrot.jbcrypt.BCrypt

import scala.concurrent.{ExecutionContext, Future}

class UserResolverImpl @Inject()(userRepo: UserRepo,
                                 jwtAuthService: JwtAuthService[JwtContent],
                                 mailService: MailService[Message, MailPayload],
                                 mailConfig: MailConfig,
                                 authConfig: AuthConfig,
                                 websiteConfig: WebsiteConfig)
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
    userId <- createdUser.id noneAsFutureFail NotFound(s"Id for user: [${createdUser.username}] is none.")
    accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
    mailingResult <- if (!skipConfirmation) {
      mailService.send(
        Message(
          subject = "Apollo universal starter kit registration.",
          content = Content().html(s"<p>${createdUser.username}, please follow the link to confirm registration.</p><br><p>${websiteConfig.url + authConfig.confirmRegistrationRoute + accessToken}</p>"),
          from = new InternetAddress(mailConfig.address),
          to = Seq(new InternetAddress(createdUser.email))
        )
      )
    } else Future.successful(MailPayload())
  } yield UserPayload(Some(createdUser), mailingResult.errors)

  override def confirmRegistration(input: ConfirmRegistrationInput): Future[AuthPayload] = for {
    tokenContent <- jwtAuthService.decodeContent(input.token) asFuture (e => InvalidToken(e.getMessage))
    user <- userRepo.find(tokenContent.id) failOnNone NotFound(s"User with id: [${tokenContent.id}] not found.")
    activeUser <- userRepo.update(user.copy(isActive = true))
    userId <- activeUser.id noneAsFutureFail NotFound(s"Id for user: [${activeUser.username}] is none.")
    accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
    refreshToken = jwtAuthService.createRefreshToken(JwtContent(userId), user.password)
  } yield AuthPayload(Some(user), Some(Tokens(accessToken, refreshToken)))

  override def login(input: LoginUserInput): Future[AuthPayload] = for {
    user <- userRepo.find(input.usernameOrEmail) failOnNone NotFound(s"User with username or email: [${input.usernameOrEmail}] not found.")
    _ <- if (BCrypt.checkpw(input.password, user.password)) Future.successful() else Future.failed(Unauthenticated())
    userId <- user.id noneAsFutureFail NotFound(s"Id for user: [${input.usernameOrEmail}] is none.")
    accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
    refreshToken = jwtAuthService.createRefreshToken(JwtContent(userId), user.password)
  } yield AuthPayload(Some(user), Some(Tokens(accessToken, refreshToken)))
}