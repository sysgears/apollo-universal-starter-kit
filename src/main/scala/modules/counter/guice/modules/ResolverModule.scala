package modules.counter.guice.modules

import modules.counter.graphql.resolvers.{CounterResolver, CounterResolverImpl}
import net.codingwell.scalaguice.ScalaModule

class ResolverModule extends ScalaModule {
  override def configure() {
    bind[CounterResolver].to[CounterResolverImpl]
  }
}