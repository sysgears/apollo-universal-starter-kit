package modules.counter.services.count

import akka.actor.{Actor, ActorLogging}
import akka.pattern._
import com.google.inject.Inject
import common.Named
import modules.counter.models.Counter
import modules.counter.repositories.CounterRepo
import modules.counter.services.count.CounterActor.{GetAmount, IncrementAndGet}

import scala.concurrent.ExecutionContext

object CounterActor extends Named {

  object GetAmount

  case class IncrementAndGet(amount: Int)

  final val name = "CounterActor"
}

class CounterActor @Inject()(counterRepo: CounterRepo)
                            (implicit executionContext: ExecutionContext) extends Actor
  with ActorLogging {

  private val defaultId = 1

  override def receive: Receive = {
    case incrementAndGet: IncrementAndGet =>
      log.info(s"Received message: [ $incrementAndGet ]")
      counterRepo.inc(Counter(Some(defaultId), incrementAndGet.amount)).pipeTo(sender)

    case GetAmount => counterRepo.find(defaultId).pipeTo(sender)
  }
}