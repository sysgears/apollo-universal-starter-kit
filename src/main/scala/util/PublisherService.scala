package util

import models.counter.Counter

import scala.concurrent.ExecutionContext

import scala.concurrent.Future
import models.counter.Counter.GraphQL.sourceCounter

trait PublisherService {

  def withPublishing(f: => Future[Counter])(implicit executionContext: ExecutionContext): Future[Counter] = {
    f.map {
      counter =>
        sourceCounter.onNext(counter)
        counter
    }
  }
}