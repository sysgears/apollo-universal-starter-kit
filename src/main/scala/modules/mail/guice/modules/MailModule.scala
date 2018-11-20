package modules.mail.guice.modules

import com.github.jurajburian.mailer.{Mailer, SessionFactory, SmtpAddress, SmtpStartTls}
import com.google.inject.{Inject, Provides, Singleton}
import com.typesafe.config.Config
import net.codingwell.scalaguice.ScalaModule

class MailModule @Inject()(config: Config) extends ScalaModule {

  val service: String = config.getString("email.service")

  @Provides
  @Singleton
  def provideMailer: Mailer = {
    val session = (
      SmtpAddress(
        config.getString(s"email.$service.host"),
        config.getInt(s"email.$service.port")
      )
        :: SmtpStartTls()
        :: SessionFactory()).session(
      Some(
        config.getString(s"email.$service.user") -> config.getString(s"email.$service.password")
      )
    )
    Mailer(session)
  }
}