package modules.mail.actor

import akka.actor.{Actor, ActorLogging}
import modules.common.FieldError
import modules.mail.models.{MailPayload, SendMail}

import scala.util.{Failure, Success, Try}

class MailActor extends Actor with ActorLogging {

  def receive: Receive = {
    case sendMail: SendMail =>
      log.info(s"Received message: [ $sendMail ]")
      val payload = Try {
        sendMail.mailer.send(sendMail.message)
      } match {
        case Success(_) => MailPayload()
        case Failure(exception) => MailPayload(Some(List(FieldError("", exception.getMessage))))
      }
      sender ! payload

    case _ => log.warning("Received unknown message")
  }
}

object MailActor {
  final val name = "MailActor"
}