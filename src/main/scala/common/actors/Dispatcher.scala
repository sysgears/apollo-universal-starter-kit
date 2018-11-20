package common.actors

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.pattern._
import akka.stream.ActorMaterializer
import common.ListUtil._
import common.actors.Dispatcher.{DispatcherMessage, Failure, InterceptorBeforeMessage, Success}
import common.{ActorMessageDelivering, Named}
import core.graphql.UserContext
import javax.inject.Inject

import scala.concurrent.ExecutionContext

//TODO: implement "interceptors after" functionality
object Dispatcher extends Named {

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
        sendMessageToActor(msg.resolverActor, msg.input)
          .pipeTo(msg.replyTo)
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