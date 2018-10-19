package modules.counter.services.count

import java.util.concurrent.TimeUnit.SECONDS

import akka.actor.ActorRef
import akka.pattern.ask
import akka.util.Timeout
import com.google.inject.name.Named
import javax.inject.Inject
import modules.counter.services.count.CounterPersistentActor.{GetAmount, IncrementAndGet}

import scala.concurrent.Future

class ActorCounterServiceImpl @Inject()(@Named(CounterPersistentActor.name) counterActor: ActorRef) extends CounterService {

  implicit val timeout: Timeout = Timeout(5, SECONDS)

  override def increment(amount: Int): Future[Int] = {
    ask(counterActor, IncrementAndGet(amount)).mapTo[Int]
  }

  override def getAmount: Future[Int] = {
    ask(counterActor, GetAmount).mapTo[Int]
  }
}