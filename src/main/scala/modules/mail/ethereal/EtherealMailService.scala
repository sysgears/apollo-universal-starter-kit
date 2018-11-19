package modules.mail.ethereal

import akka.actor.ActorRef
import akka.stream.ActorMaterializer
import com.github.jurajburian.mailer.Message
import common.ActorUtil
import javax.inject.{Inject, Named}
import modules.mail._

import scala.concurrent.{ExecutionContext, Future}

class EtherealMailService @Inject()(@Named(MailActor.name) mailActor: ActorRef)
                                   (implicit executionContext: ExecutionContext,
                                    materializer: ActorMaterializer) extends MailService[Message, MailPayload]
  with ActorUtil {

  def sent(message: Message): Future[MailPayload] = {
    sendMessageToActor[MailPayload](actorRef => mailActor ! SendMail(message, actorRef))
  }
}