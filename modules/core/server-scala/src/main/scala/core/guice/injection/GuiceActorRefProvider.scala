package core.guice.injection

import akka.actor.{ActorRef, ActorSystem, Props}
import common.ActorNamed
import core.guice.injection.InjectorProvider._

trait GuiceActorRefProvider {
  def provideActorRef(name: String)(implicit actorSystem: ActorSystem): ActorRef = {
    actorSystem.actorOf(Props(classOf[GuiceActorProducer], name, injector))
  }

  def provideActorRef[T <: ActorNamed](clazz: T)(implicit actorSystem: ActorSystem): ActorRef = {
    provideActorRef(clazz.name)
  }
}
