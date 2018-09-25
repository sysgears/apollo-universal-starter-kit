package graphql

import javax.inject.Inject
import resolvers.CounterResolver

class GraphQLContextFactory @Inject()(val counterResolver: CounterResolver) {

  def createContextForRequest = {
    GraphQLContext(counterResolver)
  }
}

case class GraphQLContext(counterResolver: CounterResolver)