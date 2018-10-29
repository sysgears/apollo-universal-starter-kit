package modules.counter.services.count

import akka.actor.{Actor, ActorLogging, Props}
import akka.pattern._
import modules.counter.models.Counter
import modules.counter.repositories.CounterRepo
import modules.counter.services.count.CounterActor.{GetAmount, IncrementAndGet}

import scala.concurrent.ExecutionContext

object CounterActor {

  object GetAmount

  case class IncrementAndGet(amount: Int)

  def props(counterRepo: CounterRepo)(implicit executionContext: ExecutionContext) = Props(new CounterActor(counterRepo))

  final val name = "CounterActor"
}

class CounterActor(counterRepo: CounterRepo)
                  (implicit executionContext: ExecutionContext) extends Actor with ActorLogging {

  private val defaultId = 1

  override def receive: Receive = {
    case incrementAndGet: IncrementAndGet =>
      log.info(s"Received message: [ $incrementAndGet ]")
      counterRepo.inc(Counter(Some(defaultId), incrementAndGet.amount)).pipeTo(sender)

    case GetAmount => counterRepo.find(defaultId).pipeTo(sender)
  }
}