package modules.mail

import akka.actor.ActorRef
import com.github.jurajburian.mailer.Message

case class SendMail(message: Message, actor: ActorRef)