package core.guice.injection

import akka.actor.{ActorRef, ActorSystem, Props}

trait GuiceActorRefProvider {
  def provideActorRef(actorSystem: ActorSystem, name: String): ActorRef = {
    actorSystem.actorOf(Props(classOf[GuiceActorProducer], name))
  }
}