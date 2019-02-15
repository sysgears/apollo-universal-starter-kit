package services

import akka.http.scaladsl.model.HttpHeader
import com.google.inject.Inject
import errors.Unauthenticated
import jwt.model.JwtContent
import jwt.service.JwtAuthService
import session.services.SessionService

import scala.util.{Failure, Success, Try}

class UserAuthService @Inject()(jwtAuthService: JwtAuthService[JwtContent], sessionService: SessionService) {
  def identify(headers: List[HttpHeader]): Try[Int] = {
    val idFromToken = headers.find(_.is("access-token")).map {
      token =>
        jwtAuthService.decodeAccessToken(token.value).map(_.id)
    }
    val idFromSession =
      sessionService
        .readSession(headers)
        .flatMap(_.userId)
        .map(Success(_))
        .getOrElse(Failure(Unauthenticated("Unauthenticated.")))

    idFromToken getOrElse idFromSession
  }
}
