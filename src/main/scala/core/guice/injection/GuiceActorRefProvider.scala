package core.guice.injection

import akka.actor.{ActorRef, ActorSystem, Props}

trait GuiceActorRefProvider {
  def provideActorRef(name: String)(implicit actorSystem: ActorSystem): ActorRef = {
    actorSystem.actorOf(Props(classOf[GuiceActorProducer], name))
  }
}