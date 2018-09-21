package services.counter

import java.util.concurrent.TimeUnit.SECONDS

import actors.counter.CountingActor
import actors.counter.CountingActor.GetAmount
import akka.actor.ActorRef
import akka.util.Timeout
import com.google.inject.name.Named
import javax.inject.Inject
import models.counter.Counter

import scala.concurrent.Future

class ActorCountingServiceImpl @Inject()(@Named(CountingActor.name) counterActor: ActorRef) extends CountingService {

  import akka.pattern.ask

  override def increment(count: Counter): Future[Int] = {
    implicit val timeout: Timeout = Timeout(5, SECONDS)
    counterActor ! count
    ask(counterActor, GetAmount).mapTo[Int]
  }
}