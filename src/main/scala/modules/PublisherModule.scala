package modules

import com.google.inject.AbstractModule
import models.counter.Counter
import net.codingwell.scalaguice.ScalaModule
import services.publisher.PublisherService
import services.publisher.actor.CounterActorPublisherServiceImpl
import services.publisher.monix.MonixPublisherServiceImpl

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