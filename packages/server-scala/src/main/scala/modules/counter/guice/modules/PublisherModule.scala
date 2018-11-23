package modules.counter.guice.modules

import core.services.publisher.{PubSubServiceImpl, PubSubService}
import modules.counter.models.Counter
import net.codingwell.scalaguice.ScalaModule

class PublisherModule extends ScalaModule {
  override def configure() {
    bind[PubSubService[Counter]].to[PubSubServiceImpl[Counter]]
  }
}