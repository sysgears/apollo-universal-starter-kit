package modules.contact.guice.modules

import akka.actor.{ActorRef, ActorSystem}
import com.github.jurajburian.mailer.Mailer
import com.google.inject.name.Named
import com.google.inject.{AbstractModule, Provides}
import com.typesafe.config.Config
import modules.contact.actor.ContactActor
import net.codingwell.scalaguice.ScalaModule

class ContactModule extends AbstractModule with ScalaModule {

  @Provides
  @Named(ContactActor.name)
  def counterActor(actorSystem: ActorSystem, mailer: Mailer, config: Config): ActorRef = {
    actorSystem.actorOf(ContactActor.props(mailer, config))
  }
}