package common.publisher

import scala.concurrent.{ExecutionContext, Future}

object RichPubSubService {

  implicit class Publisher[T](element: Future[T])(implicit executionContext: ExecutionContext) {
    def pub(triggerName: String)(implicit pubSubService: PubSubService[PublishElement[T]]): Future[T] = {
      element.map {
        publishingElement => {
          pubSubService.publish(PublishElement(triggerName, publishingElement))
          publishingElement
        }
      }
    }
  }
}