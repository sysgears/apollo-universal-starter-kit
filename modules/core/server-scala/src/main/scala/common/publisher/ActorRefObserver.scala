package common.publisher
import akka.actor.ActorRef
import akka.actor.ActorRef.noSender
import common.Logger
import monix.execution.Ack
import monix.execution.Ack.Continue
import monix.reactive.Observer

import scala.concurrent.Future

class ActorRefObserver[T](actorRef: ActorRef) extends Observer[T] with Logger {

  override def onNext(elem: T): Future[Ack] = {
    actorRef.tell(elem, noSender)
    Continue
  }

  override def onError(ex: Throwable): Unit = { //todo: check functionality of this method
    log.debug(s"Error has occurred. Reason: ${ex.getCause}")
  }

  override def onComplete(): Unit = { //todo: check functionality of this method
    log.debug(s"Event stream has closed.")
  }
}
