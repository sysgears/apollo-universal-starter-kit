package graphql.interceptors

import akka.actor.{Actor, ActorLogging, Status}
import akka.pattern._
import akka.http.scaladsl.model.HttpHeader
import com.google.inject.Inject
import common.ActorNamed
import common.errors.NotFound
import graphql.interceptors.UserInterceptor.GetUserByHeadersMessage
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import repositories.UserRepository
import common.implicits.RichDBIO._

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

object UserInterceptor extends ActorNamed {

  final val name = "UserInterceptor"

  case class GetUserByHeadersMessage(headers: List[HttpHeader])

}

class UserInterceptor @Inject()(userRepository: UserRepository,
                                jwtAuthService: JwtAuthService[JwtContent])
                               (implicit executionContext: ExecutionContext) extends Actor
  with ActorLogging {

  override def receive: Receive = {
    case msg: GetUserByHeadersMessage =>
      msg.headers.find(_.is("x-token")) match {
        case Some(token) =>
          jwtAuthService.decodeAccessToken(token.value) match {
            case Success(jwtContent) => userRepository.findOne(jwtContent.id).run.pipeTo(sender)
            case Failure(exception) => sender ! Status.Failure(exception)
          }
        case None => sender ! Status.Failure(NotFound("Token not found"))
      }
  }
}