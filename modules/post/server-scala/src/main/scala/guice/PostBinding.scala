package guice

import akka.actor.{Actor, ActorRef, ActorSystem}
import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Provides
import com.google.inject.name.Names
import common.publisher.{PubSubService, Event}
import core.guice.injection.GuiceActorRefProvider
import graphql.resolvers.PostResolver
import javax.inject.Named
import model.Post
import net.codingwell.scalaguice.ScalaModule
import repositories._
import services.publisher.PostPubSubServiceImpl
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

/**
  * Provides dependency injection functionality.
  */
class PostBinding extends ScalaModule with GuiceActorRefProvider {

  override def configure() {
    bind[Actor].annotatedWith(Names.named(PostResolver.name)).to[PostResolver]
    bind[PubSubService[Event[Post]]].to[PostPubSubServiceImpl]
  }

  @Provides
  @Named(PostResolver.name)
  def actorPost(implicit actorSystem: ActorSystem): ActorRef = provideActorRef(PostResolver)

  @Provides
  def postRepository(driver: JdbcProfile)(implicit executionContext: ExecutionContext): Repository[Post, Int] =
    new PostRepository(driver)
}
