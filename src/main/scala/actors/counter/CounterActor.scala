package actors.counter

import akka.actor.{Actor, ActorLogging, Props}
import util.Named

object CounterActor extends Named {

  object GetAmount

  case class IncrementAndGet(amount: Int)

  def props = Props(new CounterActor)

  override final val name = "CountingActor"
}

class CounterActor extends Actor with ActorLogging {

  import CounterActor._

  var counter: Int = 0

  override def receive: Receive = {

    case IncrementAndGet(amount) =>
      counter += amount
      log.info(s"Counter was increased [counter: $counter]")
      sender ! counter

    case GetAmount => sender ! counter
  }
}