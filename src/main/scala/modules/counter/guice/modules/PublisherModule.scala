package modules.counter.guice.modules

import core.services.publisher.{PublishSubscribeServiceImpl, PublishSubscribeService}
import modules.counter.models.Counter
import net.codingwell.scalaguice.ScalaModule

class PublisherModule extends ScalaModule {
  override def configure() {
    bind[PublishSubscribeService[Counter]].to[PublishSubscribeServiceImpl[Counter]]
  }
}