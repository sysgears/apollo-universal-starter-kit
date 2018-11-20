package modules.mail.models

import akka.actor.ActorRef
import com.github.jurajburian.mailer.{Mailer, Message}

case class SendMail(message: Message, mailer: Mailer, actor: ActorRef)
