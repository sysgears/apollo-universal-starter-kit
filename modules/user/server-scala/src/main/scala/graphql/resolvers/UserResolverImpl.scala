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
  override def register(input: RegisterUserInput): Future[UserPayload] = {

    val hashedPassword = BCrypt.hashpw(input.password, BCrypt.gensalt)
    val user = User(
      username = input.username,
      email = input.email,
      password = hashedPassword,
      role = "user",
      isActive = false
    )
    userRepo.save(user).map(createdUser => UserPayload(Some(createdUser)))
  }

  override def login(input: LoginUserInput): Future[AuthPayload] = for {
    user <- userRepo.find(input.usernameOrEmail) failOnNone NotFound(s"User with username or email: [${input.usernameOrEmail}] not found.")
    _ <- if (BCrypt.checkpw(input.password, user.password)) Future.successful() else Future.failed(Unauthenticated())
    userId <- user.id noneAsFutureFail NotFound(s"Id for user: [${input.usernameOrEmail}] is none.")
    accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
    refreshToken = jwtAuthService.createRefreshToken(JwtContent(userId), user.password)
  } yield AuthPayload(Some(user), Some(Tokens(accessToken, refreshToken)))
}