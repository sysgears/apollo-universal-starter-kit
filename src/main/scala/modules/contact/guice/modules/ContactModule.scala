package modules.contact.guice.modules

import modules.contact.graphql.resolvers.{ContactResolver, ContactResolverImpl}
import net.codingwell.scalaguice.ScalaModule

class ContactModule extends ScalaModule {
  override def configure(): Unit = {
    bind[ContactResolver].to[ContactResolverImpl]
  }
}