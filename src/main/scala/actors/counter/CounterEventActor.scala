package actors.counter

import actors.counter.CounterEventActor.Subscribe
import akka.actor.{Actor, ActorLogging, ActorSystem, Props}
import akka.stream.QueueOfferResult._
import akka.stream.scaladsl.SourceQueue
import models.counter.Counter

import scala.concurrent.ExecutionContext

object CounterEventActor {

  case class Subscribe(queue: SourceQueue[Counter])

  def props[T](implicit actorSystem: ActorSystem, executionContext: ExecutionContext): Props = {
    Props(new CounterEventActor(actorSystem))
  }
}

class CounterEventActor(actorSystem: ActorSystem)
                       (implicit val executionContext: ExecutionContext) extends Actor with ActorLogging {

  override def preStart {
    log.info(s"Actor [$self] starting...")
  }

  override def receive: Receive = {

    case Subscribe(queue) =>
      actorSystem.eventStream.subscribe(self, classOf[Counter])
      log.info(s"Created actor [$self] for a newly subscribed client.")
      context.become(subscribed(queue))
  }

  def subscribed(queue: SourceQueue[Counter]): Receive = {
    case e: Counter =>
      log.info(s"Pushing element [element: $e] into queue $queue")
      queue.offer(e).map {
        case Enqueued => log.info(s"Enqueued $e")
        case Dropped => log.info(s"Dropped $e")
        case Failure(ex) => log.info(s"Offer failed ${ex.getMessage}")
        case QueueClosed => log.info("Source Queue closed")
      }
  }

  override def postStop() {
    log.info(s"Actor [$self] was stopped")
  }
}