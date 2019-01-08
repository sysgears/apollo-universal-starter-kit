package guice

import actor.MailActor
import akka.actor.{Actor, ActorRef, ActorSystem}
import com.github.jurajburian.mailer._
import com.google.inject.name.{Named, Names}
import com.google.inject.{Provides, Singleton}
import com.typesafe.config.Config
import core.guice.injection.GuiceActorRefProvider
import models.MailPayload
import net.codingwell.scalaguice.ScalaModule
import services.MailService
import services.ethereal.EtherealMailService

class MailBinding extends ScalaModule with GuiceActorRefProvider {

  override def configure(): Unit = {
    bind[Actor].annotatedWith(Names.named(MailActor.name)).to[MailActor]
    bind[MailService[Message, MailPayload]].to[EtherealMailService]
  }

  @Provides
  @Named(MailActor.name)
  def actor(implicit actorSystem: ActorSystem): ActorRef = provideActorRef(MailActor)

  @Provides
  @Singleton
  @Named("ethereal")
  def provideMailer(config: Config): Mailer = {
    val session = (SmtpAddress(
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
