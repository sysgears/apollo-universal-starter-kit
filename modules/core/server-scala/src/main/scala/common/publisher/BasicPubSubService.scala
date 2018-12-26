package common.publisher

import akka.NotUsed
import akka.stream.scaladsl.Source
import common.Logger
import monix.execution.Scheduler
import monix.reactive.subjects.PublishSubject
import sangria.schema.Action

abstract class BasicPubSubService[T <: PublishElement[_]](implicit val scheduler: Scheduler) extends PubSubService[T]
  with Logger {

  lazy val source = PublishSubject[T]

  override def publish(event: T): Unit = {
    log.info(s"Item published [$event]")
    source.onNext(event)
  }

  override def subscribe(triggerNames: Seq[String], params: Seq[Param] = Nil): Source[Action[Nothing, T], NotUsed] = {
    require(triggerNames.nonEmpty)
    Source.fromPublisher(source.toReactivePublisher[T])
      .filter { element =>
        withFilter(element: T, triggerNames: Seq[String], params: Seq[Param])
      }
      .map {
        element =>
          log.info(s"Sending event [$element] to client ...")
          Action(element)
    }
  }

   def withFilter(element: T, triggerNames: Seq[String], params: Seq[Param]): Boolean
}