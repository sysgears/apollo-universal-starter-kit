package modules.counter.graphql.resolvers

import akka.NotUsed
import akka.actor.ActorRef
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Source
import com.google.inject.name.Named
import common.{ActorUtil, Logger}
import core.graphql.UserContext
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
  with ActorUtil
  with CounterResolver {

  def addServerCounter(amount: Int): Future[Counter] = withPublishing(publisherService) {
    sendMessageWithFunc[Counter](actorRef => counterActor ! IncrementAndGet(amount))
  }

  def serverCounter: Future[Counter] = {
    sendMessageWithFunc[Counter](actorRef => counterActor ! GetAmount)
  }

  def counterUpdated: Source[Action[UserContext, Counter], NotUsed] = {
    Source.fromPublisher(publisherService.getPublisher).map {
      counter =>
        log.info(s"Sending event [$counter] to client ...")
        Action(counter)
    }
  }
}