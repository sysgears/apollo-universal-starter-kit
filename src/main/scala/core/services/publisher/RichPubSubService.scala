package core.services.publisher

import scala.concurrent.{ExecutionContext, Future}

object RichPubSubService {

  implicit class Publisher[T](element: Future[T])(implicit executionContext: ExecutionContext) {
    def pub(implicit pubSubService: PubSubService[T]): Future[T] = {
      element.map {
        publishingElement => {
          pubSubService.publish(publishingElement)
          publishingElement
        }
      }
    }
  }

}