package modules

import core.services.publisher.{PubSubService, PubSubServiceImpl}
import model.{Comment, Post}
import net.codingwell.scalaguice.ScalaModule

/**
  * Provides dependency injection functionality.
  */
class PublisherModule extends ScalaModule {
  override def configure() {
    bind[PubSubService[Post]].to[PubSubServiceImpl[Post]]
    bind[PubSubService[Comment]].to[PubSubServiceImpl[Comment]]
  }
}
