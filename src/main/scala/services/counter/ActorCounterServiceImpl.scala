package services.counter

import java.util.concurrent.TimeUnit.SECONDS

import actors.counter.CounterActor
import actors.counter.CounterActor.{GetAmount, IncrementAndGet}
import akka.actor.ActorRef
import akka.pattern.ask
import akka.util.Timeout
import com.google.inject.name.Named
import javax.inject.Inject

import scala.concurrent.Future

class ActorCounterServiceImpl @Inject()(@Named(CounterActor.name) counterActor: ActorRef) extends CounterService {

  implicit val timeout: Timeout = Timeout(5, SECONDS)

  override def increment(amount: Int): Future[Int] = {
    ask(counterActor, IncrementAndGet(amount)).mapTo[Int]
  }

  override def getAmount: Future[Int] = {
    ask(counterActor, GetAmount).mapTo[Int]
  }
}