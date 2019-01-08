package guice

import akka.actor.{Actor, ActorRef, ActorSystem}
import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Provides
import com.google.inject.name.Names
import core.guice.injection.GuiceActorRefProvider
import graphql.resolvers.ItemResolver
import javax.inject.Named
import model.Item
import net.codingwell.scalaguice.ScalaModule
import repositories.ItemRepository
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

/**
  * Provides dependency injection functionality.
  */
class ItemBinding extends ScalaModule with GuiceActorRefProvider {

  override def configure(): Unit = {
    bind[Actor].annotatedWith(Names.named(ItemResolver.name)).to[ItemResolver]
  }

  @Provides
  def itemRepository(driver: JdbcProfile)(implicit executionContext: ExecutionContext): Repository[Item, Int] =
    new ItemRepository(driver)

  @Provides
  @Named(ItemResolver.name)
  def actor(implicit actorSystem: ActorSystem): ActorRef = provideActorRef(ItemResolver)
}
