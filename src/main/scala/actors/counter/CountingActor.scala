package actors.counter

import akka.actor.{Actor, ActorLogging}
import com.typesafe.config.Config
import javax.inject.Inject
import models.counter.Counter
import util.Named

object CountingActor extends Named {

  object GetAmount

  override final val name = "CountingActor"
}

class CountingActor @Inject()(config: Config) extends Actor with ActorLogging {

  import CountingActor._

  var counter: Int = config.getInt("counter.initial-amount")

  override def receive: Receive = {

    case Counter(amount) =>
      counter += amount
      log.info(s"Counter was increased [counter: $counter]")

    case GetAmount => sender ! counter
  }
}