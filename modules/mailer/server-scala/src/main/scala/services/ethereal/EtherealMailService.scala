package services.ethereal

import actor.MailActor
import actor.MailActor.SendMail
import akka.actor.ActorRef
import akka.stream.ActorMaterializer
import com.github.jurajburian.mailer.{Mailer, Message}
import common.actors.ActorMessageDelivering
import javax.inject.{Inject, Named}
import models.MailPayload
import services.MailService

import scala.concurrent.{ExecutionContext, Future}

class EtherealMailService @Inject()(@Named(MailActor.name) mailActor: ActorRef,
                                    @Named("ethereal") mailer: Mailer)
                                   (implicit executionContext: ExecutionContext,
                                    materializer: ActorMaterializer) extends MailService[Message, MailPayload]
  with ActorMessageDelivering {

  override def send(message: Message): Future[MailPayload] = sendMessageToActor(mailActor, SendMail(message, mailer))
}