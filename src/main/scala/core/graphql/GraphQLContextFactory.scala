package core.graphql

import core.services.publisher.PublisherService
import javax.inject.Inject
import modules.counter.graphql.resolvers.CounterResolver
import modules.counter.models.Counter

class GraphQLContextFactory @Inject()(val counterResolver: CounterResolver,
                                      val publisherService: PublisherService[Counter]) {

  def createContextForRequest: GraphQLContext = {
    GraphQLContext(counterResolver, publisherService)
  }
}

case class GraphQLContext(counterResolver: CounterResolver,
                          publisherService: PublisherService[Counter])