package repositories

import core.slick.{SchemaInitializer, SchemaUtil}
import javax.inject.Inject
import model.Post
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.{ExecutionContext, Future}

class PostSchemaInitializer @Inject()(database: Database)
                                     (implicit executionContext: ExecutionContext) extends SchemaInitializer
  with SchemaUtil {

  val posts: TableQuery[Post.Table] = TableQuery[Post.Table]

  override def create(): Future[Unit] = {
    withTable(database, posts, Post.name, _.isEmpty) {
      DBIO.seq(posts.schema.create)
    }
  }

  override def drop(): Future[Unit] = {
    withTable(database, posts, Post.name, _.nonEmpty) {
      DBIO.seq(posts.schema.drop)
    }
  }
}