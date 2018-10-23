package modules.counter.graphql.resolvers

import java.util.concurrent.TimeUnit.SECONDS

import akka.NotUsed
import akka.actor.ActorRef
import akka.stream.scaladsl.Source
import akka.util.Timeout
import core.services.publisher.{PublisherHelper, PublisherService}
import javax.inject.Inject
import modules.counter.models.Counter
import modules.counter.services.count.CounterPersistentActor.{GetAmount, IncrementAndGet}
import sangria.schema.Action
import akka.pattern.ask
import com.google.inject.name.Named
import modules.counter.services.count.CounterPersistentActor
import util.Logger

import scala.concurrent.{ExecutionContext, Future}

class CounterResolverImpl @Inject()(@Named(CounterPersistentActor.name) counterActor: ActorRef,
                                    publisherService: PublisherService[Counter])
                                   (implicit executionContext: ExecutionContext) extends PublisherHelper[Counter]
  with Logger
  with CounterResolver {

  implicit val timeout: Timeout = Timeout(5, SECONDS)

  def addServerCounter(amount: Int): Future[Counter] = withPublishing(publisherService) {
    ask(counterActor, IncrementAndGet(amount)).mapTo[Int].map(Counter)
  }

  def serverCounter: Future[Counter] = {
    ask(counterActor, GetAmount).mapTo[Int].map(Counter)
  }

  def counterUpdated: Source[Action[Unit, Counter], NotUsed] = {
    Source.fromPublisher(publisherService.getPublisher).map {
      e =>
        log.info(s"Sending event [$e] to client ...")
        Action(e)
    }
  }
}