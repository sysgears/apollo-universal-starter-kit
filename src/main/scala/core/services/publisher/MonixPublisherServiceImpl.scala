package core.services.publisher

import akka.NotUsed
import akka.stream.scaladsl.Source
import common.Logger
import javax.inject.{Inject, Singleton}
import monix.execution.Scheduler
import monix.reactive.OverflowStrategy
import monix.reactive.subjects.ConcurrentSubject
import org.reactivestreams.Publisher
import sangria.schema.Action

@Singleton
class MonixPublisherServiceImpl[T] @Inject()(implicit val scheduler: Scheduler) extends PublisherService[T] with Logger {

  lazy val source: ConcurrentSubject[T, T] = ConcurrentSubject.publish[T](OverflowStrategy.DropOld(16))

  override def getPublisher: Publisher[T] = source.toReactivePublisher[T]

  override def publish(event: T): Unit = source.onNext(event)

  override def subscribe: Source[Action[Nothing, T], NotUsed] = {
    Source.fromPublisher(getPublisher).map {
      counter =>
        log.info(s"Sending event [$counter] to client ...")
        Action(counter)
    }
  }
}