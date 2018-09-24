package services.counter

import java.util.concurrent.TimeUnit.SECONDS

import actors.counter.CounterActor
import actors.counter.CounterActor.IncrementAndGet
import akka.actor.ActorRef
import akka.util.Timeout
import com.google.inject.name.Named
import javax.inject.Inject
import models.counter.Counter

import scala.concurrent.Future

class ActorCounterServiceImpl @Inject()(@Named(CounterActor.name) counterActor: ActorRef) extends CounterService {

  import akka.pattern.ask

  override def increment(counter: Counter): Future[Int] = {
    implicit val timeout: Timeout = Timeout(5, SECONDS)
    ask(counterActor, IncrementAndGet(counter.amount)).mapTo[Int]
  }
}