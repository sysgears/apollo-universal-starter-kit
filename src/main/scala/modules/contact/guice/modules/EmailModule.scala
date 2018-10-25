package modules.contact.guice.modules

import com.github.jurajburian.mailer.{Mailer, SessionFactory, SmtpAddress, SmtpStartTls}
import com.google.inject.{AbstractModule, Provides}
import com.typesafe.config.Config
import javax.inject.Singleton
import net.codingwell.scalaguice.ScalaModule

class EmailModule extends AbstractModule with ScalaModule {

  @Provides
  @Singleton
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