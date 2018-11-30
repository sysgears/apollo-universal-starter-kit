package modules

import actor.MailActor
import akka.actor.{Actor, ActorRef, ActorSystem}
import com.github.jurajburian.mailer.{Mailer, SessionFactory, SmtpAddress, SmtpStartTls}
import com.google.inject.name.{Named, Names}
import com.google.inject.{Provides, Singleton}
import com.typesafe.config.Config
import core.guice.injection.GuiceActorRefProvider
import net.codingwell.scalaguice.ScalaModule

class MailModule extends ScalaModule with GuiceActorRefProvider {

  override def configure(): Unit = {
    bind[Actor].annotatedWith(Names.named(MailActor.name)).to[MailActor]
  }

  @Provides
  @Named(MailActor.name)
  def actor(implicit actorSystem: ActorSystem): ActorRef = provideActorRef(MailActor)

  @Provides
  @Singleton
  @Named("ethereal")
  def provideMailer(config: Config): Mailer = {
    val session = (
      SmtpAddress(
        config.getString("email.ethereal.host"),
        config.getInt("email.ethereal.port")
      )
        :: SmtpStartTls()
        :: SessionFactory()).session(
      Some(
        config.getString("email.ethereal.user") -> config.getString("email.ethereal.password")
      )
    )
    Mailer(session)
  }
}