package routes

import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import com.google.inject.Inject
import common.errors.{AlreadyExists, NotFound}
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import common.implicits.RichDBIO._
import common.implicits.RichFuture._
import common.implicits.RichTry._
import repositories.UserRepository

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

class ConfirmRegistrationController @Inject()(
    userRepository: UserRepository,
    jwtAuthService: JwtAuthService[JwtContent]
)(implicit val executionContext: ExecutionContext) {

  val routes: Route =
    (path("confirmation") & get) {
      parameters('token) {
        token =>
          onComplete {
            for {
              tokenContent <- jwtAuthService.decodeContent(token).asFuture
              user <- userRepository.findOne(tokenContent.id).run failOnNone NotFound(
                s"User with id: [${tokenContent.id}] not found."
              )
              _ <- if (!user.isActive) userRepository.update(user.copy(isActive = true)).run
              else Future.failed(AlreadyExists(s"User with id: [${user.id}] is active"))
            } yield ()
          } {
            case Success(_) => redirect("/login", StatusCodes.Found)
            case Failure(_) => reject
          }
      }
    }
}
