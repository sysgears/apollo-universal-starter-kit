package graphql.resolvers

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import com.google.inject.Inject
import common.ActorNamed
import common.errors.NotFound
import model.Tokens
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import repositories.UserRepository
import common.implicits.RichFuture._
import common.implicits.RichTry._
import common.implicits.RichDBIO._

import scala.concurrent.{ExecutionContext, Future}

object TokenResolver extends ActorNamed {
  final val name = "TokensResolver"
}

class TokenResolver @Inject()(userRepository: UserRepository,
                              jwtAuthService: JwtAuthService[JwtContent])
                             (implicit executionContext: ExecutionContext) extends Actor
  with ActorLogging {

  override def receive: Receive = {
    case refreshToken: String => {
      for {
        tokenContent <- jwtAuthService.decodeContent(refreshToken).asFuture
        user <- userRepository.findOne(tokenContent.id).run failOnNone NotFound(s"User with id: [${tokenContent.id}] not found.")
        userId <- Future.successful(user.id) failOnNone NotFound(s"Id for user: [${user.username}] is none.")
        accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
        refreshToken = jwtAuthService.createRefreshToken(JwtContent(userId), user.password)
      } yield Tokens(accessToken, refreshToken)
    }.pipeTo(sender)

    case unknownMessage@_ => log.warning(s"Received unknown message: $unknownMessage")
  }
}