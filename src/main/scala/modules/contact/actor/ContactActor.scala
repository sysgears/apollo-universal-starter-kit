package modules.contact.actor

import akka.actor.{Actor, ActorLogging, ActorRef}
import com.github.jurajburian.mailer.{Content, Mailer, Message}
import com.google.inject.Inject
import com.typesafe.config.Config
import common.ActorNamed
import javax.mail.internet.InternetAddress
import modules.common.FieldError
import modules.contact.actor.ContactActor.SendMail
import modules.contact.models.{Contact, ContactPayload}

import scala.util.{Failure, Success, Try}

object ContactActor extends ActorNamed {

  case class SendMail(contact: Contact, sender: ActorRef)

  final val name = "ContactActor"
}

class ContactActor @Inject()(mailer: Mailer,
                             config: Config) extends Actor with ActorLogging {

  def receive: Receive = {
    case sendMail: SendMail =>
      log.info(s"Received message: [ $sendMail ]")
      val contact = sendMail.contact
      val content = Content().html(s"<p>${contact.name} is sending the following message.</p><p>${contact.content}</p>")
      val message = Message(
        subject = "New email through contact us page",
        content = content,
        from = new InternetAddress(contact.email),
        to = Seq(new InternetAddress(config.getString("email.user")))
      )
      val payload = Try {
        mailer.send(message)
      } match {
        case Success(_) => ContactPayload()
        case Failure(exception) => ContactPayload(Some(List(FieldError("", exception.getMessage))))
      }
      sendMail.sender ! payload

    case _ => log.info("Received unknown message")
  }
}