package modules.contact.guice.modules

import com.github.jurajburian.mailer.{Mailer, SessionFactory, SmtpAddress, SmtpStartTls}
import com.google.inject.AbstractModule
import com.typesafe.config.ConfigFactory
import net.codingwell.scalaguice.ScalaModule

class EmailModule extends AbstractModule with ScalaModule {

  override def configure() {
    val config = ConfigFactory.load
    val session = (SmtpAddress(config.getString("email.host"), config.getInt("email.port"))
      :: SmtpStartTls()
      :: SessionFactory()).session(Some(config.getString("email.user") -> config.getString("email.password")))
    bind[Mailer].toInstance(Mailer(session))
  }
}