package services

import com.github.jurajburian.mailer.{Content, Message}
import javax.mail.internet.InternetAddress
import model.User

class MessageTemplateService {

  def createConfirmRegistrationMessage(user: User, appName: String, fromEmail: String, followLink: String): Message =
    Message(
      subject = "Confirm Email",
      content = Content().html(s"""<p>Hi, ${user.username}!</p>
           | <p>Welcome to $appName. Please click the following link to confirm your email:</p>
           | <p><a href="$followLink">$followLink</a></p>""".stripMargin),
      from = new InternetAddress(fromEmail),
      to = Seq(new InternetAddress(user.email))
    )

  def createRecoverPasswordMessage(user: User, appName: String, fromEmail: String, followLink: String): Message =
    Message(
      subject = "Reset Password",
      content = Content().html(s"""<p>Please click this link to reset your password:</p>
           | <a href="$followLink">$followLink</a>""".stripMargin),
      from = new InternetAddress(fromEmail),
      to = Seq(new InternetAddress(user.email))
    )
}
