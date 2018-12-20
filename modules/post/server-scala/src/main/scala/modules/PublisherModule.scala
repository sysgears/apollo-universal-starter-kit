package modules

import core.services.publisher.{PubSubService, PublishElement}
import model.{Comment, Post}
import net.codingwell.scalaguice.ScalaModule
import services.publisher.{CommentPubSubServiceImpl, PostPubSubServiceImpl}

/**
  * Provides dependency injection functionality.
  */
class PublisherModule extends ScalaModule {
  override def configure() {
    bind[PubSubService[PublishElement[Post]]].to[PostPubSubServiceImpl]
    bind[PubSubService[PublishElement[Comment]]].to[CommentPubSubServiceImpl]
  }
}
