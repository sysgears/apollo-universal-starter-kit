package resolvers

import javax.inject.Inject
import models.counter.Counter
import services.counter.CounterService

import scala.concurrent.{ExecutionContext, Future}

class CounterResolver @Inject()(val counterService: CounterService)
                               (implicit executionContext: ExecutionContext) {

  def addServerCounter(amount: Int): Future[Counter] = counterService.increment(amount).map(Counter(_))

  def serverCounter: Future[Counter] = counterService.getAmount.map(Counter(_))
}