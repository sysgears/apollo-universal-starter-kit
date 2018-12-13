package modules

import akka.actor.{Actor, ActorRef, ActorSystem}
import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Provides
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import graphql.resolvers.CommentResolver
import javax.inject.Named
import model.Comment
import net.codingwell.scalaguice.ScalaModule
import repositories._
import slick.jdbc.JdbcProfile

/**
  * Provides dependency injection functionality.
  */
class CommentModule extends ScalaModule with GuiceActorRefProvider {

  override def configure() {
    bind[Actor].annotatedWith(Names.named(CommentResolver.name)).to[CommentResolver]
  }

  @Provides
  @Named(CommentResolver.name)
  def actorComment(implicit actorSystem: ActorSystem): ActorRef = provideActorRef(CommentResolver)

  @Provides
  def commentRepository(driver: JdbcProfile): Repository[Comment, Int] = new CommentRepository(driver)
}