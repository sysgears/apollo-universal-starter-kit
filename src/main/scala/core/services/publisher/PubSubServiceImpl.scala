package core.services.publisher

import akka.NotUsed
import akka.stream.scaladsl.Source
import common.Logger
import javax.inject.{Inject, Singleton}
import monix.execution.Scheduler
import monix.reactive.OverflowStrategy
import monix.reactive.subjects.ConcurrentSubject
import sangria.schema.Action

@Singleton
class PubSubServiceImpl[T] @Inject()(implicit val scheduler: Scheduler) extends PubSubService[T]
  with Logger {

  lazy val source: ConcurrentSubject[T, T] = ConcurrentSubject.publish[T](OverflowStrategy.DropOld(16))

  override def publish(event: T): Unit = source.onNext(event)

  override def subscribe: Source[Action[Nothing, T], NotUsed] = {
    Source.fromPublisher(source.toReactivePublisher[T]).map {
      element =>
        log.info(s"Sending event [$element] to client ...")
        Action(element)
    }
  }
}