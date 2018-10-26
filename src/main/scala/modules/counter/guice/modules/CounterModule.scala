package modules.counter.guice.modules

import akka.actor.{ActorRef, ActorSystem}
import com.google.inject.Provides
import com.google.inject.name.Named
import modules.counter.repositories.{CounterRepo, CounterRepoImpl}
import modules.counter.services.count.CounterActor
import net.codingwell.scalaguice.ScalaModule

import scala.concurrent.ExecutionContext

class CounterModule extends ScalaModule {

  override def configure() {
    bind[CounterRepo].to[CounterRepoImpl]
  }

  @Provides
  @Named(CounterActor.name)
  def counterActor(actorSystem: ActorSystem, counterRepo: CounterRepo)
                  (implicit executionContext: ExecutionContext): ActorRef = {
    actorSystem.actorOf(CounterActor.props(counterRepo))
  }
}