package common.publisher

import akka.NotUsed
import akka.stream.scaladsl.Source
import common.Logger
import monix.execution.Scheduler
import monix.reactive.subjects.PublishSubject
import sangria.schema.Action

abstract class BasicPubSubService[T <: Event[_]](implicit val scheduler: Scheduler) extends PubSubService[T]
  with Logger {

  lazy val source = PublishSubject[T]

  override def publish(event: T): Unit = {
    log.debug(s"Item published [ $event ]")
    source.onNext(event)
  }

  override def subscribe(eventNames: Seq[String], params: Seq[Param] = Nil): Source[Action[Nothing, T], NotUsed] = {
    require(eventNames.nonEmpty)
    Source.fromPublisher(source.toReactivePublisher[T])
      .filter { event =>
        withFilter(event: T, eventNames: Seq[String], params: Seq[Param])
      }
      .map {
        event =>
          log.debug(s"Sending event [ $event ] to client ...")
          Action(event)
    }
  }

   def withFilter(event: T, eventNames: Seq[String], params: Seq[Param]): Boolean
}