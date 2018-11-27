package graphql.resolvers

import akka.actor.{Actor, ActorLogging, ActorRef}
import com.google.inject.name.Named
import common.ActorNamed
import javax.inject.Inject
import services.count.CounterActor
import services.count.CounterActor.{GetAmount, IncrementAndGet}

object CounterResolver extends ActorNamed {
  final val name = "CounterResolver"
}

class CounterResolver @Inject()(@Named(CounterActor.name) counterActor: ActorRef) extends Actor
  with ActorLogging {

  override def receive: Receive = {
    case amount: Int => counterActor.forward(IncrementAndGet(amount))

    case GetAmount => counterActor.forward(GetAmount)
  }
}