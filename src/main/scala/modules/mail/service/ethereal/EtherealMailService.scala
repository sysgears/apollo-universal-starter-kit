package modules.mail.service.ethereal

import akka.actor.ActorRef
import akka.stream.ActorMaterializer
import com.github.jurajburian.mailer.{Mailer, Message}
import common.ActorMessageDelivering
import javax.inject.{Inject, Named}
import modules.mail.actor.MailActor
import modules.mail.actor.MailActor.SendMail
import modules.mail.models.MailPayload
import modules.mail.service.MailService

import scala.concurrent.{ExecutionContext, Future}

class EtherealMailService @Inject()(@Named(MailActor.name) mailActor: ActorRef,
                                    @Named("ethereal") mailer: Mailer)
                                   (implicit executionContext: ExecutionContext,
                                    materializer: ActorMaterializer) extends MailService[Message, MailPayload]
  with ActorMessageDelivering {

  def sent(message: Message): Future[MailPayload] = sendMessageToActor(mailActor, SendMail(message, mailer))
}