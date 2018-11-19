package core.services.publisher

import akka.NotUsed
import akka.stream.scaladsl.Source
import org.reactivestreams.Publisher
import sangria.schema.Action

trait PublisherService[T] {

  def publish(event: T)

  def getPublisher: Publisher[T]

  def subscribe: Source[Action[Nothing, T], NotUsed]
}
