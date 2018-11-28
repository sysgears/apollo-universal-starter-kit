package repositories

import core.slick.{SchemaInitializer, SchemaUtil}
import javax.inject.Inject
import model.CommentTable
import model.CommentTable.CommentTable
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.{ExecutionContext, Future}

class CommentSchemaInitializer @Inject()(database: Database)
                                        (implicit executionContext: ExecutionContext) extends SchemaInitializer
  with SchemaUtil {

  val comments: TableQuery[CommentTable] = TableQuery[CommentTable]

  override def create(): Future[Unit] = {
    withTable(database, comments, CommentTable.name, _.isEmpty) {
      DBIO.seq(comments.schema.create)
    }
  }

  override def drop(): Future[Unit] = {
    withTable(database, comments, CommentTable.name, _.nonEmpty) {
      DBIO.seq(comments.schema.drop)
    }
  }
}