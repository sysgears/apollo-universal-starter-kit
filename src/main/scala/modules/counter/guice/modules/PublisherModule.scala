package modules.counter.guice.modules

import core.services.publisher.{PublisherServiceImpl, PublisherService}
import modules.counter.models.Counter
import net.codingwell.scalaguice.ScalaModule

class PublisherModule extends ScalaModule {
  override def configure() {
    bind[PublisherService[Counter]].to[PublisherServiceImpl[Counter]]
  }
}