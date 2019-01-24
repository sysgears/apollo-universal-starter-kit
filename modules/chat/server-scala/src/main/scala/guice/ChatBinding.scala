package guice

import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Provides
import core.guice.injection.GuiceActorRefProvider
import models.DbMessage
import net.codingwell.scalaguice.ScalaModule
import repositories.ChatRepository
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class ChatBinding extends ScalaModule with GuiceActorRefProvider {

  override def configure(): Unit = {}

  @Provides
  def chatRepository(driver: JdbcProfile)(implicit executionContext: ExecutionContext): Repository[DbMessage, Int] =
    new ChatRepository(driver)

}
