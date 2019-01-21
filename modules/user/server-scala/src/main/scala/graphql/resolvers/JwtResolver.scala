package graphql.resolvers

import com.google.inject.Inject
import common.errors.NotFound
import common.implicits.RichDBIO._
import common.implicits.RichFuture._
import common.implicits.RichTry._
import jwt.model.{JwtContent, Tokens}
import jwt.service.JwtAuthService
import repositories.UserRepository

import scala.concurrent.{ExecutionContext, Future}

class JwtResolver @Inject()(userRepository: UserRepository, jwtAuthService: JwtAuthService[JwtContent])(
    implicit executionContext: ExecutionContext
) {

  def refreshTokens(refreshToken: String): Future[Tokens] =
    for {
      tokenContent <- jwtAuthService.decodeContent(refreshToken).asFuture
      user <- userRepository.findOne(tokenContent.id).run failOnNone NotFound(
        s"User with id: [${tokenContent.id}] not found."
      )
      _ <- jwtAuthService.decodeRefreshToken(refreshToken, user.password).asFuture
      accessToken = jwtAuthService.createAccessToken(JwtContent(tokenContent.id))
      refreshToken = jwtAuthService.createRefreshToken(JwtContent(tokenContent.id), user.password)
    } yield Tokens(accessToken, refreshToken)
}
