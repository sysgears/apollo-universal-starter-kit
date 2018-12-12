package common.actors

import akka.actor.{Actor, ActorLogging, ActorRef, Status}
import akka.pattern._
import akka.stream.ActorMaterializer
import common.implicits.RichList._
import common.actors.Dispatcher.{DispatcherMessage, Failure, InterceptorBeforeMessage, Success}
import common.errors.Error
import common.{ActorMessageDelivering, ActorNamed}
import core.graphql.UserContext
import javax.inject.Inject

import scala.concurrent.ExecutionContext

//TODO: implement "interceptors after" functionality
object Dispatcher extends ActorNamed {

  final val name = "Dispatcher"

  final case class DispatcherMessage(input: Any,
                                     context: UserContext,
                                     replyTo: ActorRef,
                                     resolverActor: ActorRef,
                                     onException: Exception => Any,
                                     before: List[ActorRef] = Nil,
                                     after: List[ActorRef] = Nil)

  final case class InterceptorBeforeMessage(input: Any,
                                            context: UserContext,
                                            before: List[ActorRef])

  final case class InterceptorAfterMessage(input: Any,
                                           output: Any,
                                           context: UserContext,
                                           after: List[ActorRef])

  final case class ResolverMessage(input: Any, context: UserContext)

  sealed trait InterceptorResultStatus

  final case class Failure(e: Exception) extends InterceptorResultStatus

  final object Success extends InterceptorResultStatus

}

class Dispatcher @Inject()(implicit actorMaterializer: ActorMaterializer,
                           executionContext: ExecutionContext) extends Actor
  with ActorLogging
  with ActorMessageDelivering {

  override def receive: Receive = {
    case msg: DispatcherMessage =>
      val interceptors = msg.before
      if (interceptors.nonEmpty) {
        context.become(withInterceptors(msg))
        val (head, tail) = interceptors.cutOff

        head ! InterceptorBeforeMessage(
          input = msg.input,
          context = msg.context,
          before = tail
        )
      } else {
        sendMessageToActor[Any](msg.resolverActor, msg.input).andThen {
          case scala.util.Success(r) => msg.replyTo ! r
          case scala.util.Failure(f: Error) => msg.replyTo ! msg.onException(f)
          case scala.util.Failure(f) ⇒ msg.replyTo ! Status.Failure(f)
        }
      }
  }

  def withInterceptors(msg: DispatcherMessage): Receive = {
    case Success =>
      log.info(s"Interceptor has finished successfully")
      sendMessageToActor(msg.resolverActor, msg.input)
        .pipeTo(msg.replyTo)

    case Failure(e) =>
      log.info(s"Interceptor has finished with failure. Reason: '$e'")
      msg.replyTo ! msg.onException(e)
  }
}