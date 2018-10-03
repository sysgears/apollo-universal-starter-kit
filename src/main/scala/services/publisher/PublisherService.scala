package services.publisher

import org.reactivestreams.Publisher

trait PublisherService[T] {

  def publish(event: T)

  def getPublisher: Publisher[T]
}
