package common.actors

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.pattern._
import akka.stream.ActorMaterializer
import common.{ActorUtil, Named}
import common.ListUtil._
import common.actors.Dispatcher.{Success, _}
import core.graphql.UserContext
import javax.inject.Inject

import scala.concurrent.ExecutionContext

object Dispatcher extends Named {

  final val name = "Dispatcher"

  final case class DispatcherMessage(input: Any,
                                     context: UserContext,
                                     replyTo: ActorRef,
                                     resolverActor: ActorRef,
                                     onException: Exception => Any,
                                     filtersBefore: List[ActorRef] = Nil,
                                     filtersAfter: List[ActorRef] = Nil)

  final case class InterceptorBeforeMessage(input: Any,
                                            context: UserContext,
                                            filtersBefore: List[ActorRef])

  final case class InterceptorAfterMessage(input: Any,
                                           output: Any,
                                           context: UserContext,
                                           filtersAfter: List[ActorRef])

  case class ResolverMessage(input: Any, context: UserContext)

  sealed trait InterceptorResultStatus

  final case class Failure(e: Exception) extends InterceptorResultStatus

  final object Success extends InterceptorResultStatus

}

class Dispatcher @Inject()(implicit actorMaterializer: ActorMaterializer,
                           executionContext: ExecutionContext) extends Actor
  with ActorLogging
  with ActorUtil {

  override def receive: Receive = {
    case msg: DispatcherMessage =>
      val filters = msg.filtersBefore
      if (filters.nonEmpty) {
        context.become(withFilters(msg))
        val (head, tail) = filters.cutOff

        head ! InterceptorBeforeMessage(
          input = msg.input,
          context = msg.context,
          filtersBefore = tail
        )
      } else {
        sendMessageToActor(msg.resolverActor, msg.input)
          .pipeTo(msg.replyTo)
      }
  }

  def withFilters(msg: DispatcherMessage): Receive = {
    case Success =>
      log.info(s"Interceptor has finished successfully")
      sendMessageToActor(msg.resolverActor, msg.input)
        .pipeTo(msg.replyTo)

    case Failure(e) =>
      log.info(s"Interceptor has finished with failure. Reason: '$e'")
      msg.replyTo ! msg.onException(e)
  }
}