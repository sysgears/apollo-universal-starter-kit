package common.actors

import akka.actor.{Actor, ActorLogging, ActorRef}
import akka.stream.scaladsl.{Sink, Source}
import akka.stream.{ActorMaterializer, OverflowStrategy}
import core.graphql.UserContext
import javax.inject.Inject
import akka.pattern._
import common.ActorUtil
import common.actors.Dispatcher.DispatcherInput

import scala.concurrent.{ExecutionContext, Future}

object Dispatcher {

  final val name = "Dispatcher"

  case class DispatcherInput(input: Any,
                             context: UserContext,
                             resolverActor: ActorRef,
                             sender: ActorRef,
                             filtersBefore: List[ActorRef] = Nil,
                             filtersAfter: List[ActorRef] = Nil)

  case class FilterBeforeInput(input: Any,
                               context: UserContext,
                               dispatcherActor: ActorRef,
                               filtersBefore: List[ActorRef])

  case class FilterAfterInput(input: Any,
                              output: Any,
                              context: UserContext,
                              dispatcherActor: ActorRef,
                              filtersAfter: List[ActorRef])

  case class ResolverInput(input: Any,
                           context: UserContext,
                           dispatcherActor: ActorRef)

}

class Dispatcher @Inject()(implicit actorMaterializer: ActorMaterializer,
                           executionContext: ExecutionContext) extends Actor
  with ActorLogging
  with ActorUtil {

  override def receive: Receive = {
    case dispatcherInput: DispatcherInput => {
      sendMessageToActor[Any](dispatcherInput.resolverActor, dispatcherInput.input)
        .pipeTo(dispatcherInput.sender)
    }
  }
}