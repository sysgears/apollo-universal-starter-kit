package guice.modules

import core.services.publisher.{PubSubService, PublishElement}
import models.Counter
import net.codingwell.scalaguice.ScalaModule
import services.publisher.CounterPubSubServiceImpl

class PublisherModule extends ScalaModule {
  override def configure() {
    bind[PubSubService[PublishElement[Counter]]].to[CounterPubSubServiceImpl]
  }
}