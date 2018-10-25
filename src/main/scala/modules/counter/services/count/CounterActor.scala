package modules.counter.services.count

import akka.actor.{Actor, ActorLogging, Props}
import akka.pattern._
import core.services.persistence.PersistenceCleanup
import modules.counter.models.Counter
import modules.counter.repositories.CounterRepo
import modules.counter.services.count.CounterActor.{GetAmount, IncrementAndGet}
import util.Named

import scala.concurrent.ExecutionContext

object CounterActor extends Named {

  object GetAmount

  case class IncrementAndGet(amount: Int)

  def props(counterRepo: CounterRepo)(implicit executionContext: ExecutionContext) = Props(new CounterActor(counterRepo))

  override final val name = "CounterActor"
}

class CounterActor(counterRepo: CounterRepo)
                  (implicit executionContext: ExecutionContext) extends Actor with ActorLogging {

  private val defaultId = 1

  override def receive: Receive = {
    case incrementAndGet: IncrementAndGet =>
      log.info(s"Received message: [ $incrementAndGet ]")
      counterRepo.inc(Counter(Some(defaultId), incrementAndGet.amount)).pipeTo(sender)

    case GetAmount => {
      counterRepo.find(defaultId).pipeTo(sender)
    }
  }
}