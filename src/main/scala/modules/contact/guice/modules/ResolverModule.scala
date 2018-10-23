package modules.contact.guice.modules

import com.google.inject.AbstractModule
import modules.contact.graphql.resolvers.{ContactResolver, ContactResolverImpl}
import net.codingwell.scalaguice.ScalaModule

class ResolverModule extends AbstractModule with ScalaModule {
  override def configure() {
    bind[ContactResolver].to[ContactResolverImpl]
  }
}