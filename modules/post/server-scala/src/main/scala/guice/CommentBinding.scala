package guice

import akka.actor.{Actor, ActorRef, ActorSystem}
import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Provides
import com.google.inject.name.Names
import common.publisher.{PubSubService, Event}
import core.guice.injection.GuiceActorRefProvider
import graphql.resolvers.CommentResolver
import javax.inject.Named
import model.Comment
import net.codingwell.scalaguice.ScalaModule
import repositories._
import services.publisher.CommentPubSubServiceImpl
import slick.jdbc.JdbcProfile

/**
  * Provides dependency injection functionality.
  */
class CommentBinding extends ScalaModule with GuiceActorRefProvider {

  override def configure() {
    bind[Actor].annotatedWith(Names.named(CommentResolver.name)).to[CommentResolver]
    bind[PubSubService[Event[Comment]]].to[CommentPubSubServiceImpl]
  }

  @Provides
  @Named(CommentResolver.name)
  def actorComment(implicit actorSystem: ActorSystem): ActorRef = provideActorRef(CommentResolver)

  @Provides
  def commentRepository(driver: JdbcProfile): Repository[Comment, Int] = new CommentRepository(driver)
}
