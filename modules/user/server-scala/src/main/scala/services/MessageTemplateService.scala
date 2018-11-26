package services

import com.github.jurajburian.mailer.{Content, Message}
import javax.mail.internet.InternetAddress
import model.User

class MessageTemplateService {

  def createConfirmRegistrationMessage(user: User, fromEmail: String, followLink: String): Message = {
    Message(
      subject = "Apollo universal starter kit registration.",
      content = Content().html(s"<p>${user.username}, please follow the link to confirm registration.</p><br><p>$followLink</p>"),
      from = new InternetAddress(fromEmail),
      to = Seq(new InternetAddress(user.email))
    )
  }
}