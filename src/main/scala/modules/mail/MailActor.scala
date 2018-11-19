package modules.mail

import akka.actor.{Actor, ActorLogging}
import com.github.jurajburian.mailer.Mailer
import com.google.inject.Inject
import com.typesafe.config.Config
import modules.common.FieldError

import scala.util.{Failure, Success, Try}

class MailActor @Inject()(mailer: Mailer,
                          config: Config) extends Actor with ActorLogging {

  def receive: Receive = {
    case sendMail: SendMail =>
      log.info(s"Received message: [ $sendMail ]")
      val payload = Try {
        mailer.send(sendMail.message)
      } match {
        case Success(_) => MailPayload()
        case Failure(exception) => MailPayload(Some(List(FieldError("", exception.getMessage))))
      }
      sendMail.actor ! payload

    case _ => log.warning("Received unknown message")
  }
}

object MailActor {
  final val name = "MailActor"
}