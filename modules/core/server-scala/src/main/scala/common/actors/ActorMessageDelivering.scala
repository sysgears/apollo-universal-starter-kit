package common.actors

import akka.actor.ActorRef
import akka.stream.scaladsl.{Sink, Source}
import akka.stream.{ActorMaterializer, OverflowStrategy}

import scala.concurrent.Future

trait ActorMessageDelivering {
  def sendMessageWithFunc[T](f: ActorRef => Unit)(implicit actorMaterializer: ActorMaterializer): Future[T] = {
    Source.actorRef[T](1024, OverflowStrategy.fail)
      .mapMaterializedValue(f)
      .runWith(Sink.head[T])
  }

  def sendMessageToActor[T](recipient: ActorRef, message: Any)(implicit actorMaterializer: ActorMaterializer): Future[T] = {
    sendMessageWithFunc[T](sender => recipient.tell(message, sender))
  }
}