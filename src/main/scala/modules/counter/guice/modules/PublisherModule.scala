package modules.counter.guice.modules

import com.google.inject.AbstractModule
import core.services.publisher.{MonixPublisherServiceImpl, PublisherService}
import modules.counter.models.Counter
import net.codingwell.scalaguice.ScalaModule

class PublisherModule extends AbstractModule with ScalaModule {
  override def configure() {
    bind[PublisherService[Counter]].to[MonixPublisherServiceImpl[Counter]]
  }
}