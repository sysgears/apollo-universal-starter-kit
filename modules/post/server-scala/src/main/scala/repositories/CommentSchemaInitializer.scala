package repositories

import core.slick.{SchemaInitializer, SchemaUtil}
import javax.inject.Inject
import model.{Comment, CommentTable}
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
      DBIO.seq(comments.schema.create,
      comments ++= fillDatabase)
    }
  }

  override def drop(): Future[Unit] = {
    withTable(database, comments, CommentTable.name, _.nonEmpty) {
      DBIO.seq(comments.schema.drop)
    }
  }

  /**
    * Helper method for generating 'Comment' entities
    *
    * @return list of 'Comment' entities
    */
  def fillDatabase: List[Comment] = {
    List.range(1, 10).map(num =>
      Comment(id = Some(num),
        content = s" Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim " +
          s"id [$num] est laborum.",
        postId = 1))
  }
}