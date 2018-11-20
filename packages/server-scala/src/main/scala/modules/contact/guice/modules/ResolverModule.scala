package modules.contact.guice.modules

import modules.contact.graphql.resolvers.{ContactResolver, ContactResolverImpl}
import net.codingwell.scalaguice.ScalaModule

class ResolverModule extends ScalaModule {
  override def configure() {
    bind[ContactResolver].to[ContactResolverImpl]
  }
}