package resolvers

import javax.inject.Inject
import models.counter.Counter
import services.counter.CounterService
import services.publisher.PublisherService
import util.PublisherHelper

import scala.concurrent.{ExecutionContext, Future}

class CounterResolver @Inject()(val counterService: CounterService,
                                publisherService: PublisherService[Counter])
                               (implicit executionContext: ExecutionContext) extends PublisherHelper[Counter] {

  def addServerCounter(amount: Int): Future[Counter] = withPublishing(publisherService) {
    counterService.increment(amount).map(Counter(_))
  }

  def serverCounter: Future[Counter] = counterService.getAmount.map(Counter(_))
}