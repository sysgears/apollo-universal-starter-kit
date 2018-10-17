package services.publisher.actor

import actors.counter.CounterEventActor
import actors.counter.CounterEventActor.Subscribe
import akka.actor.{ActorSystem, PoisonPill}
import akka.stream.scaladsl.{Keep, Sink, Source}
import akka.stream.{ActorMaterializer, OverflowStrategy}
import javax.inject.{Inject, Singleton}
import models.counter.Counter
import org.reactivestreams.Publisher
import services.publisher.PublisherService
import util.Logger

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

@Singleton
class CounterActorPublisherServiceImpl @Inject()(implicit val actorSystem: ActorSystem,
                                                 executionContext: ExecutionContext,
                                                 actorMaterializer: ActorMaterializer) extends PublisherService[Counter]
  with Logger {

  override def publish(event: Counter): Unit = actorSystem.eventStream.publish(event)

  override def getPublisher: Publisher[Counter] = {
    val counterEventPublisher = actorSystem.actorOf(CounterEventActor.props)

    val (queue, publisher) = Source.queue[Counter](16, OverflowStrategy.fail)
      .toMat(Sink.asPublisher(false))(Keep.both)
      .run
    counterEventPublisher ! Subscribe(queue)
    queue.watchCompletion.onComplete {
      case Success(_) =>
        log.info(s"Queue [$queue] closed successfully.")
        counterEventPublisher ! PoisonPill

      case Failure(exception) =>
        log.info(s"Queue [$queue] closed with fail. Reason: $exception.")
        counterEventPublisher ! PoisonPill
    }
    publisher
  }
}