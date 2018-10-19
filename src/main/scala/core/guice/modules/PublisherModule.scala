package core.guice.modules

import com.google.inject.AbstractModule
import core.services.publisher.{MonixPublisherServiceImpl, PublisherService}
import models.counter.Counter
import net.codingwell.scalaguice.ScalaModule
import services.publisher.actor.CounterActorPublisherServiceImpl

class PublisherModule extends AbstractModule with ScalaModule {
  override def configure() {
    monixImpl()
  }

  def monixImpl() {
    bind[PublisherService[Counter]].to[MonixPublisherServiceImpl[Counter]]
  }

  def actorsImpl() {
    bind[PublisherService[Counter]].to[CounterActorPublisherServiceImpl]
  }
}