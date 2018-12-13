package modules

import akka.actor.{Actor, ActorRef, ActorSystem}
import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Provides
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import graphql.resolvers.PostResolver
import javax.inject.Named
import model.Post
import net.codingwell.scalaguice.ScalaModule
import repositories._
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

/**
  * Provides dependency injection functionality.
  */
class PostModule extends ScalaModule with GuiceActorRefProvider {

  override def configure() {
    bind[Actor].annotatedWith(Names.named(PostResolver.name)).to[PostResolver]
  }

  @Provides
  @Named(PostResolver.name)
  def actorPost(implicit actorSystem: ActorSystem): ActorRef = provideActorRef(PostResolver)

  @Provides
  def postRepository(driver: JdbcProfile)(implicit executionContext: ExecutionContext): Repository[Post, Int] = new PostRepository(driver)
}