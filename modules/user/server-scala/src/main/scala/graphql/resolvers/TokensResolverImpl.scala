package graphql.resolvers

import com.google.inject.Inject
import common.errors.NotFound
import common.implicits.RichFuture._
import common.implicits.RichOption._
import common.implicits.RichTry._
import model.Tokens
import modules.jwt.errors.InvalidToken
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import repositories.UserRepo

import scala.concurrent.{ExecutionContext, Future}

class TokensResolverImpl @Inject()(userRepo: UserRepo,
                                   jwtAuthService: JwtAuthService[JwtContent])
                                  (implicit executionContext: ExecutionContext) extends TokensResolver {

  override def refreshTokens(refreshToken: String): Future[Tokens] = for {
    tokenContent <- jwtAuthService.decodeContent(refreshToken) asFuture (e => InvalidToken(e.getMessage))
    user <- userRepo.find(tokenContent.id) failOnNone NotFound(s"User with id: [${tokenContent.id}] not found.")
    userId <- user.id noneAsFutureFail NotFound(s"Id for user: [${user.username}] is none.")
    accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
    refreshToken = jwtAuthService.createRefreshToken(JwtContent(userId), user.password)
  } yield Tokens(accessToken, refreshToken)
}