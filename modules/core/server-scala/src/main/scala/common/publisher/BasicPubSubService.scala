package common.publisher

import akka.NotUsed
import akka.stream.OverflowStrategy
import akka.stream.scaladsl.Source
import common.Logger
import common.graphql.UserContext
import modules.socket.WebSocketMessageContext
import monix.execution.Scheduler
import monix.reactive.subjects.PublishSubject
import sangria.schema.Action

abstract class BasicPubSubService[T <: Event[_]](implicit scheduler: Scheduler) extends PubSubService[T] with Logger {

  lazy val source: PublishSubject[T] = PublishSubject[T]

  override def publish(event: T): Unit = {
    source.onNext(event).foreach(_ => log.debug(s"Item has published [ $event ]"))
  }

  override def subscribe(eventNames: Seq[String], params: Seq[Param] = Nil)(
      implicit userContext: UserContext
  ): Source[Action[Nothing, T], NotUsed] = {

    Source
      .actorRef[T](16, OverflowStrategy.dropHead)
      .mapMaterializedValue {
        actorRef =>
          userContext.webSocketMessageContext.foreach {
            wsc: WebSocketMessageContext =>
              val graphQlSubs = wsc.graphQlSubs
              graphQlSubs.cancel(id = wsc.graphQlOperationId)

              val cancelable = source.subscribe(new ActorRefObserver[T](actorRef))
              graphQlSubs.add(wsc.graphQlOperationId, cancelable)
          }
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
