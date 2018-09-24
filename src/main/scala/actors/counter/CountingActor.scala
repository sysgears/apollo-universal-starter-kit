package actors.counter

import akka.actor.{Actor, ActorLogging}
import util.Named

object CountingActor extends Named {

  object GetAmount

  case class IncrementAndGet(amount: Int)

  override final val name = "CountingActor"
}

class CountingActor extends Actor with ActorLogging {

  import CountingActor._

  var counter: Int = 0

  override def receive: Receive = {

    case IncrementAndGet(amount) =>
      counter += amount
      log.info(s"Counter was increased [counter: $counter]")
      sender ! counter

    case GetAmount => sender ! counter
  }
}