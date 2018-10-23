package modules.counter.guice.modules

import com.google.inject.AbstractModule
import modules.counter.graphql.resolvers.{CounterResolver, CounterResolverImpl}
import net.codingwell.scalaguice.ScalaModule

class ResolverModule extends AbstractModule with ScalaModule{
  override def configure(){
    bind[CounterResolver].to[CounterResolverImpl]
  }
}
