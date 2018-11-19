package modules.mail.guice.modules

import com.github.jurajburian.mailer.{Mailer, SessionFactory, SmtpAddress, SmtpStartTls}
import com.google.inject.Provides
import com.typesafe.config.Config
import net.codingwell.scalaguice.ScalaModule

class MailModule extends ScalaModule {

  @Provides
  def provideMailer(config: Config): Mailer = {
    val session = (
      SmtpAddress(
        config.getString("email.host"),
        config.getInt("email.port")
      )
        :: SmtpStartTls()
        :: SessionFactory()).session(
      Some(
        config.getString("email.user") -> config.getString("email.password")
      )
    )
    Mailer(session)
  }
}