package guice.modules

import core.services.publisher.{PubSubService, PubSubServiceImpl}
import models.Counter
import net.codingwell.scalaguice.ScalaModule

class PublisherModule extends ScalaModule {
  override def configure() {
    bind[PubSubService[Counter]].to[PubSubServiceImpl[Counter]]
  }
}