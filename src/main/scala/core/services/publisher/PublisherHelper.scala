package core.services.publisher

import scala.concurrent.{ExecutionContext, Future}

trait PublisherHelper[T] {

  def withPublishing(publisherService: PublisherService[T])(f: => Future[T])(implicit executionContext: ExecutionContext): Future[T] = {
    f.map {
      event =>
        publisherService.publish(event)
        event
    }
  }
}
