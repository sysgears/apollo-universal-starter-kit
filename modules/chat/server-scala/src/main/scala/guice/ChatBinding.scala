package guice

import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Provides
import common.publisher.{Event, PubSubService}
import core.guice.injection.GuiceActorRefProvider
import graphql.resolver.{ChatResolver, ChatResolverImpl}
import models.{DbMessage, Message}
import net.codingwell.scalaguice.ScalaModule
import repositories.ChatRepository
import services.publisher.MessagePubSubServiceImpl
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class ChatBinding extends ScalaModule with GuiceActorRefProvider {

  override def configure(): Unit = {
    bind[ChatResolver].to[ChatResolverImpl]
    bind[PubSubService[Event[Message]]].to[MessagePubSubServiceImpl]
  }

  @Provides
  def chatRepository(driver: JdbcProfile)(implicit executionContext: ExecutionContext): Repository[DbMessage, Int] = {
    new ChatRepository(driver)
  }
}
