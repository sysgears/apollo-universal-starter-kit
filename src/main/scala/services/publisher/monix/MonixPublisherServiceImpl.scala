package services.publisher.monix

import javax.inject.{Inject, Singleton}
import monix.execution.Scheduler
import monix.reactive.OverflowStrategy
import monix.reactive.subjects.ConcurrentSubject
import org.reactivestreams.Publisher
import services.publisher.PublisherService

@Singleton
class MonixPublisherServiceImpl[T] @Inject()(implicit val scheduler: Scheduler) extends PublisherService[T] {

  lazy val sourceCounter: ConcurrentSubject[T, T] = ConcurrentSubject.publish[T](OverflowStrategy.DropOld(16))

  override def getPublisher: Publisher[T] = sourceCounter.toReactivePublisher[T]

  override def publish(event: T) = {
    println(s"Event [$event] is publishing...")
    sourceCounter.onNext(event)
  }
}