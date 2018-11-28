package guice.modules

import com.github.jurajburian.mailer.Message
import graphql.resolvers.{ContactResolver, ContactResolverImpl}
import modules.mail.models.MailPayload
import modules.mail.service.MailService
import modules.mail.service.ethereal.EtherealMailService
import net.codingwell.scalaguice.ScalaModule

class ContactModule extends ScalaModule {
  override def configure(): Unit = {
    bind[ContactResolver].to[ContactResolverImpl]
    bind[MailService[Message, MailPayload]].to[EtherealMailService]
  }
}