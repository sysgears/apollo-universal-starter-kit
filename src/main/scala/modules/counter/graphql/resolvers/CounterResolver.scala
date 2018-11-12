package modules.counter.graphql.resolvers

import akka.NotUsed
import akka.stream.scaladsl.Source
import core.graphql.UserContext
import modules.counter.models.Counter
import sangria.schema.Action

import scala.concurrent.Future

trait CounterResolver {

  def addServerCounter(amount: Int): Future[Counter]

  def serverCounter: Future[Counter]

  def counterUpdated: Source[Action[UserContext, Counter], NotUsed]
}
