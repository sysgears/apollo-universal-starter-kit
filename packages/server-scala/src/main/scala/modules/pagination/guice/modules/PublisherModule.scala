package modules.pagination.guice.modules

import core.services.publisher.{PubSubService, PubSubServiceImpl}
import modules.pagination.model.DataObjectsPayload
import net.codingwell.scalaguice.ScalaModule

class PublisherModule extends ScalaModule {
  override def configure() {
    bind[PubSubService[DataObjectsPayload]].to[PubSubServiceImpl[DataObjectsPayload]]
  }
}
