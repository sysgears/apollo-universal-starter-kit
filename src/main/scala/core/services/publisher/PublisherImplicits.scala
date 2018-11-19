package core.services.publisher

import scala.concurrent.{ExecutionContext, Future}

object PublisherImplicits {

  implicit class Publish[T](element: Future[T])(implicit executionContext: ExecutionContext) {
    def pub(implicit publisherService: PublishSubscribeService[T]): Future[T] = {
      element.map {
        publishingElement => {
          publisherService.publish(publishingElement)
          publishingElement
        }
      }
    }
  }

}