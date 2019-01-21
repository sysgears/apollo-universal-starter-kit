package common.publisher

import akka.NotUsed
import akka.actor.ActorRef
import akka.stream.OverflowStrategy
import akka.stream.scaladsl.Source
import common.Logger
import common.graphql.UserContext
import monix.execution.Ack.Continue
import monix.execution.{Ack, Scheduler}
import monix.reactive.Observer
import monix.reactive.observers.Subscriber
import monix.reactive.subjects.PublishSubject
import sangria.schema.Action

import scala.concurrent.Future

abstract class BasicPubSubService[T <: Event[_]](implicit scheduler: Scheduler) extends PubSubService[T] with Logger {

  lazy val source = PublishSubject[T]

  override def publish(event: T): Unit = {
    log.debug(s"Item published [ $event ]")
    source.onNext(event)
  }

  override def subscribe(eventNames: Seq[String], params: Seq[Param] = Nil)(
      implicit userContext: UserContext
  ): Source[Action[Nothing, T], NotUsed] = {

    Source
      .actorRef[T](16, OverflowStrategy.dropHead)
      .mapMaterializedValue {
        actorRef =>
          val subscriber = Subscriber(new CustomObserver[T](actorRef), scheduler)
          val cancelable = source.subscribe(subscriber)
          userContext.socketSubscription.foreach(
            existSocketSubscription =>
              existSocketSubscription.socketConnection.add(existSocketSubscription.id, cancelable)
          )
          NotUsed
      }
      .filter {
        event =>
          eventNames.contains(event.name) && filter(event, params)
      }
      .map {
        event =>
          log.debug(s"Sending event [ $event ] to client ...")
          Action(event)
      }
  }

  /**
    * To filter subscription by specified params, override this method.
    */
  def filter(event: T, params: Seq[Param]) = true
}

class CustomObserver[T](actorRef: ActorRef)(implicit val scheduler: Scheduler) extends Observer[T] {
  override def onNext(elem: T): Future[Ack] = {
    actorRef.tell(elem, ActorRef.noSender)
    Continue
  }
  //TODO Implement!!!
  override def onError(ex: Throwable): Unit = ()
  override def onComplete(): Unit = ()
}
