package services.counter

import models.counter.Counter

import scala.concurrent.Future

trait CounterService {
  def increment(count: Counter): Future[Int]
}