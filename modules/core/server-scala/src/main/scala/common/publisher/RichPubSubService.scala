package common.publisher

import scala.concurrent.{ExecutionContext, Future}

object RichPubSubService {

  implicit class Publisher[T](element: Future[T])(implicit executionContext: ExecutionContext) {
    def pub(eventName: String)(implicit pubSubService: PubSubService[Event[T]]): Future[T] = {
      element.map {
        publishingElement =>
          {
            pubSubService.publish(Event(eventName, publishingElement))
            publishingElement
          }
      }
    }
  }
}
