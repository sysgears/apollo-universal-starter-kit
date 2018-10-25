package modules.counter.graphql.resolvers

import java.util.concurrent.TimeUnit.SECONDS

import akka.NotUsed
import akka.actor.ActorRef
import akka.pattern.ask
import akka.stream.scaladsl.Source
import akka.util.Timeout
import com.google.inject.name.Named
import core.services.publisher.{PublisherHelper, PublisherService}
import javax.inject.Inject
import modules.counter.models.Counter
import modules.counter.services.count.CounterActor
import modules.counter.services.count.CounterActor.{GetAmount, IncrementAndGet}
import sangria.schema.Action
import util.Logger

import scala.concurrent.{ExecutionContext, Future}

class CounterResolverImpl @Inject()(@Named(CounterActor.name) counterActor: ActorRef,
                                    publisherService: PublisherService[Counter])
                                   (implicit executionContext: ExecutionContext) extends PublisherHelper[Counter]
  with Logger
  with CounterResolver {

  implicit val timeout: Timeout = Timeout(5, SECONDS)

  def addServerCounter(amount: Int): Future[Counter] = withPublishing(publisherService) {
    ask(counterActor, IncrementAndGet(amount)).mapTo[Counter]
  }

  def serverCounter: Future[Counter] = {
    ask(counterActor, GetAmount).mapTo[Counter]
  }

  def counterUpdated: Source[Action[Unit, Counter], NotUsed] = {
    Source.fromPublisher(publisherService.getPublisher).map {
      e =>
        log.info(s"Sending event [$e] to client ...")
        Action(e)
    }
  }
}