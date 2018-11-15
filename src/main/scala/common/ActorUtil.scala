package common

import akka.actor.ActorRef
import akka.stream.scaladsl.{Sink, Source}
import akka.stream.{ActorMaterializer, OverflowStrategy}

import scala.concurrent.Future

trait ActorUtil {
  def sendMessageToActor[T](f: ActorRef => Unit)(implicit actorMaterializer: ActorMaterializer): Future[T] = {
    Source.actorRef[T](0, OverflowStrategy.dropHead)
      .mapMaterializedValue(f)
      .runWith(Sink.head[T])
  }
}