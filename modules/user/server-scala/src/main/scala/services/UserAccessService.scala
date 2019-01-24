package services

import common.implicits.RichDBIO._
import common.implicits.RichTry._
import common.implicits.RichFuture._
import akka.http.scaladsl.model.HttpHeader
import com.google.inject.Inject
import common.errors.NotFound
import config.AuthConfig
import errors.Forbidden
import repositories.UserRepository

import scala.concurrent.{ExecutionContext, Future}

class UserAccessService @Inject()(
    authConfig: AuthConfig,
    userAuthService: UserAuthService,
    userRepository: UserRepository
)(implicit executionContext: ExecutionContext) {

  def withAdminFilter[T](headers: List[HttpHeader], operation: Future[T]): Future[T] =
    if (authConfig.turnOffAdminFilter) operation
    else {
      for {
        id <- userAuthService.identify(headers).asFuture
        user <- userRepository.findOne(id).run failOnNone NotFound(s"User with id = $id")
        trustedOperation <- if (user.role == "admin") operation
        else Future.failed(Forbidden(s"User with id = $id does not have admin rights"))
      } yield trustedOperation
    }
}
