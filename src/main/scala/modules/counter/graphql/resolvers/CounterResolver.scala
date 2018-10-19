package modules.counter.graphql.resolvers

import core.services.publisher.{PublisherHelper, PublisherService}
import javax.inject.Inject
import modules.counter.models.Counter
import modules.counter.services.count.CounterService

import scala.concurrent.{ExecutionContext, Future}

class CounterResolver @Inject()(val counterService: CounterService,
                                publisherService: PublisherService[Counter])
                               (implicit executionContext: ExecutionContext) extends PublisherHelper[Counter] {

  def addServerCounter(amount: Int): Future[Counter] = withPublishing(publisherService) {
    counterService.increment(amount).map(Counter(_))
  }

  def serverCounter: Future[Counter] = counterService.getAmount.map(Counter(_))
}