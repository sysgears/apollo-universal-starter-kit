package repositories

import core.slick.{SchemaInitializer, SchemaUtil}
import javax.inject.Inject
import model.Comment
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.{ExecutionContext, Future}

class CommentSchemaInitializer @Inject()(database: Database)
                                        (implicit executionContext: ExecutionContext) extends SchemaInitializer
  with SchemaUtil {

  val comments: TableQuery[Comment.Table] = TableQuery[Comment.Table]

  override def create(): Future[Unit] = {
    withTable(database, comments, Comment.name, _.isEmpty) {
      DBIO.seq(comments.schema.create)
    }
  }

  override def drop(): Future[Unit] = {
    withTable(database, comments, Comment.name, _.nonEmpty) {
      DBIO.seq(comments.schema.drop)
    }
  }
}