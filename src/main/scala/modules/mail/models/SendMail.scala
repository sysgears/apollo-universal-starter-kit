package modules.mail.models

import com.github.jurajburian.mailer.{Mailer, Message}

case class SendMail(message: Message, mailer: Mailer)