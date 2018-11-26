package core.guice.injection

import akka.actor.{ActorRef, ActorSystem, Props}
import common.ActorNamed

trait GuiceActorRefProvider {
  def provideActorRef(name: String)(implicit actorSystem: ActorSystem): ActorRef = {
    actorSystem.actorOf(Props(classOf[GuiceActorProducer], name))
  }

  def provideActorRef[T <: ActorNamed](clazz: T)(implicit actorSystem: ActorSystem): ActorRef = {
    provideActorRef(clazz.name)
  }
}