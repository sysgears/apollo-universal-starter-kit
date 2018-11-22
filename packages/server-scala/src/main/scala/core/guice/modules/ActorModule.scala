package core.guice.modules

import akka.actor.{Actor, ActorSystem}
import com.google.inject.Provides
import com.google.inject.name.Names
import common.actors.Dispatcher
import core.guice.injection.GuiceActorRefProvider
import javax.inject.Named
import net.codingwell.scalaguice.ScalaModule

class ActorModule extends ScalaModule with GuiceActorRefProvider {

  override def configure(): Unit = {
    bind[Actor].annotatedWith(Names.named(Dispatcher.name)).to[Dispatcher]
  }

  @Provides
  @Named(Dispatcher.name)
  def dispatcherActor(implicit actorSystem: ActorSystem) = {
    provideActorRef(Dispatcher.name)
  }
}