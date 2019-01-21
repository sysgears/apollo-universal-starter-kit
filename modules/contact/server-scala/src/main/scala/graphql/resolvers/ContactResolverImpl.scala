package graphql.resolvers

import com.github.jurajburian.mailer.{Content, Message}
import com.google.inject.Inject
import com.typesafe.config.Config
import javax.mail.internet.InternetAddress
import models.{Contact, ContactPayload, MailPayload}
import services.MailService

import scala.concurrent.{ExecutionContext, Future}

class ContactResolverImpl @Inject()(mailService: MailService[Message, MailPayload], config: Config)(
    implicit executionContext: ExecutionContext
) extends ContactResolver {

  override def sendMail(contact: Contact): Future[ContactPayload] =
    mailService
      .send(
        Message(
          subject = "New email through contact us page",
          content = Content().html(s"<p>${contact.name} is sending the following message.</p><p>${contact.content}</p>"),
          from = new InternetAddress(contact.email),
          to = Seq(new InternetAddress(config.getString("email.ethereal.user")))
        )
      )
      .map(mailPayload => ContactPayload(mailPayload.errors))
}
