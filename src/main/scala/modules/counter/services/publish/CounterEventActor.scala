package modules.counter.services.publish

import akka.actor.{Actor, ActorLogging, ActorSystem, Props}
import akka.stream.QueueOfferResult._
import akka.stream.scaladsl.SourceQueue
import modules.counter.models.Counter
import modules.counter.services.publish.CounterEventActor.Subscribe

import scala.concurrent.ExecutionContext

object CounterEventActor {

  case class Subscribe(queue: SourceQueue[Counter])

  def props(implicit actorSystem: ActorSystem, executionContext: ExecutionContext): Props = {
    Props(new CounterEventActor(actorSystem))
  }
}

class CounterEventActor(actorSystem: ActorSystem)
                       (implicit val executionContext: ExecutionContext) extends Actor
  with ActorLogging {

  override def receive: Receive = {

    case Subscribe(queue) =>
      actorSystem.eventStream.subscribe(self, classOf[Counter])
      log.info(s"Actor [$self] has been created for a newly subscribed client")
      context.become(subscribed(queue))
  }

  def subscribed(queue: SourceQueue[Counter]): Receive = {
    case counter: Counter =>
      log.info(s"Pushing element [$counter] into queue [$queue]")
      queue.offer(counter).map {
        case Enqueued => log.info(s"Added [$counter] to queue [${queue.hashCode}]")
        case Dropped => log.info(s"Dropped [$counter] from [$queue]")
        case Failure(ex) => log.info(s"Queue [$queue]. Offer failed [${ex.getMessage}]")
        case QueueClosed => log.info(s"Queue [$queue] closed")
      }
  }

  override def postStop {
    log.info(s"Actor [$self] has been stopped")
  }
}