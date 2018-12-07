package core.guice.injection

import akka.actor.{Actor, IndirectActorProducer}
import com.google.inject.Key
import com.google.inject.name.Names
import core.guice.Injector

class GuiceActorProducer(actorName: String) extends IndirectActorProducer {
  override def produce(): Actor = {
    Injector.injector.getBinding(Key.get(classOf[Actor], Names.named(actorName))).getProvider.get()
  }

  override def actorClass: Class[_ <: Actor] = {
    classOf[Actor]
  }
}