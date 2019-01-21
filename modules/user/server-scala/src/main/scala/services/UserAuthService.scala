package services

import common.implicits.RichDBIO._
import common.implicits.RichTry._
import common.implicits.RichFuture._
import akka.http.scaladsl.model.HttpHeader
import com.google.inject.Inject
import common.errors.NotFound
import errors.{Unauthenticated, Unauthorized}
import jwt.model.JwtContent
import jwt.service.JwtAuthService
import repositories.UserRepository
import session.services.SessionService

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}

class UserAuthService @Inject()(
    userRepository: UserRepository,
    jwtAuthService: JwtAuthService[JwtContent],
    sessionService: SessionService
)(implicit executionContext: ExecutionContext) {

  def identify(headers: List[HttpHeader]): Try[Int] = {
    val idFromToken = headers.find(_.is("access-token")).map {
      token =>
        jwtAuthService.decodeAccessToken(token.value).map(_.id)
    }
    val idFromSession =
      sessionService.readSession(headers).flatMap(_.userId).map(Success(_)).getOrElse(Failure(Unauthenticated()))

    idFromToken getOrElse idFromSession
  }

  def withAdminFilter[T](headers: List[HttpHeader], operation: Future[T]): Future[T] =
    for {
      id <- identify(headers).asFuture
      user <- userRepository.findOne(id).run failOnNone NotFound(s"User with id = $id")
      trustedOperation <- if (user.role == "admin") operation
      else Future.failed(Unauthorized(s"User with id = $id does not have admin rights"))
    } yield trustedOperation

}
