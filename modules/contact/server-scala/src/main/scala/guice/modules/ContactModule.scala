package guice.modules

import com.github.jurajburian.mailer.Message
import graphql.resolvers.{ContactResolver, ContactResolverImpl}
import models.MailPayload
import net.codingwell.scalaguice.ScalaModule
import services.MailService
import services.ethereal.EtherealMailService

class ContactModule extends ScalaModule {
  override def configure(): Unit = {
    bind[ContactResolver].to[ContactResolverImpl]
    bind[MailService[Message, MailPayload]].to[EtherealMailService]
  }
}