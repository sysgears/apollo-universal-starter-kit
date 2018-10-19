package modules.counter.services.count

import scala.concurrent.Future

trait CounterService {

  def increment(amount: Int): Future[Int]

  def getAmount: Future[Int]
}
