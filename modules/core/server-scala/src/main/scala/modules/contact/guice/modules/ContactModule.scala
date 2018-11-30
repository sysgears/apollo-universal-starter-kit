package modules.contact.guice.modules

import com.github.jurajburian.mailer.Message
import modules.contact.graphql.resolvers.{ContactResolver, ContactResolverImpl}
import modules.mail.models.MailPayload
import modules.mail.services.MailService
import modules.mail.services.ethereal.EtherealMailService
import net.codingwell.scalaguice.ScalaModule

class ContactModule extends ScalaModule {
  override def configure(): Unit = {
    bind[ContactResolver].to[ContactResolverImpl]
    bind[MailService[Message, MailPayload]].to[EtherealMailService]
  }
}