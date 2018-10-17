package graphql

import javax.inject.Inject
import models.counter.Counter
import resolvers.CounterResolver
import services.publisher.PublisherService

class GraphQLContextFactory @Inject()(val counterResolver: CounterResolver,
                                      val publisherService: PublisherService[Counter]) {

  def createContextForRequest: GraphQLContext = {
    GraphQLContext(counterResolver, publisherService)
  }
}

case class GraphQLContext(counterResolver: CounterResolver,
                          publisherService: PublisherService[Counter])