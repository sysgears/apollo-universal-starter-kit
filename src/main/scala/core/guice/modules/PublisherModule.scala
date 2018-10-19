package core.guice.modules

import com.google.inject.AbstractModule
import core.services.publisher.{MonixPublisherServiceImpl, PublisherService}
import modules.counter.models.Counter
import modules.counter.services.publish.CounterActorPublisherServiceImpl
import net.codingwell.scalaguice.ScalaModule

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