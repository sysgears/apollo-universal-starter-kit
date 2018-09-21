package services.counter

import models.counter.Counter

import scala.concurrent.Future

trait CountingService {
  def increment(count: Counter): Future[Int]
}