package modules.common.actors

import akka.actor.{Actor, ActorLogging, ActorRef}
import core.graphql.UserContext
import modules.common.actors.DispatcherActor.DispatcherInput

object DispatcherActor {

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

class DispatcherActor extends Actor with ActorLogging {
  override def receive: Receive = {
    case msg: DispatcherInput => ()
  }
}