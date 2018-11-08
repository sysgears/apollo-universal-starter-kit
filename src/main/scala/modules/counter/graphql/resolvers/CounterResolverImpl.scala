package modules.counter.graphql.resolvers

import akka.NotUsed
import akka.actor.ActorRef
import akka.stream.scaladsl.{Sink, Source}
import akka.stream.{ActorMaterializer, OverflowStrategy}
import com.google.inject.name.Named
import common.Logger
import core.services.publisher.{PublisherHelper, PublisherService}
import javax.inject.Inject
import modules.counter.models.Counter
import modules.counter.services.count.CounterActor
import modules.counter.services.count.CounterActor.{GetAmount, IncrementAndGet}
import sangria.schema.Action

import scala.concurrent.{ExecutionContext, Future}

class CounterResolverImpl @Inject()(@Named(CounterActor.name) counterActor: ActorRef,
                                    publisherService: PublisherService[Counter])
                                   (implicit executionContext: ExecutionContext,
                                    materializer: ActorMaterializer) extends PublisherHelper[Counter]
  with Logger
  with CounterResolver {

  def addServerCounter(amount: Int): Future[Counter] = withPublishing(publisherService) {
    sendMessageToActor(actorRef => counterActor ! IncrementAndGet(amount, actorRef))
  }

  def serverCounter: Future[Counter] = {
    sendMessageToActor(actorRef => counterActor ! GetAmount(actorRef))
  }

  def counterUpdated: Source[Action[Unit, Counter], NotUsed] = {
    Source.fromPublisher(publisherService.getPublisher).map {
      counter =>
        log.info(s"Sending event [$counter] to client ...")
        Action(counter)
    }
  }

  private def sendMessageToActor(f: ActorRef => Unit): Future[Counter] = {
    Source.actorRef[Counter](0, OverflowStrategy.dropHead)
      .mapMaterializedValue(f)
      .runWith(Sink.head[Counter])
  }
}