package core.guice.modules

import akka.actor.{Actor, ActorSystem}
import com.google.inject.Provides
import com.google.inject.name.Names
import common.actors.DispatcherActor
import core.guice.injection.GuiceActorRefProvider
import javax.inject.Named
import net.codingwell.scalaguice.ScalaModule

class ActorModule extends ScalaModule with GuiceActorRefProvider {

  override def configure(): Unit = {
    bind[Actor].annotatedWith(Names.named(DispatcherActor.name)).to[DispatcherActor]
  }

  @Provides
  @Named(DispatcherActor.name)
  def dispatcherActor(implicit actorSystem: ActorSystem) = {
    provideActorRef(DispatcherActor.name)
  }
}