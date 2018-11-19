package core.services.publisher

import akka.NotUsed
import akka.stream.scaladsl.Source
import sangria.schema.Action

trait PublishSubscribeService[T] {

  def publish(event: T)

  def subscribe: Source[Action[Nothing, T], NotUsed]
}
