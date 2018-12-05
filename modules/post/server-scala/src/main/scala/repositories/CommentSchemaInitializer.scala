package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.{Comment, CommentTable}
import model.CommentTable.CommentTable
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class CommentSchemaInitializer @Inject()(database: Database)
                                        (implicit executionContext: ExecutionContext) extends SchemaInitializer[CommentTable] {

  override val name: String = CommentTable.name
  override val table = TableQuery[CommentTable]
  override val db = database

  override def seedDatabase(tableQuery: TableQuery[CommentTable]): DBIOAction[_, NoStream, Effect.Write] = {
    val comments = List.range(1, 10).map(num =>
      Comment(id = Some(num),
        content = s" Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim " +
          s"id [$num] est laborum.",
        postId = 1))
    tableQuery ++= comments
  }
}