package repositories

import common.slick.SchemaInitializer
import javax.inject.Inject
import model.{Comment, CommentTable}
import model.CommentTable.CommentTable

import scala.concurrent.ExecutionContext

class CommentSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext) extends SchemaInitializer[CommentTable] {

  import driver.api._

  override val name: String = CommentTable.name
  override val table = TableQuery[CommentTable]

  override def initData: driver.api.DBIOAction[_, driver.api.NoStream, Effect.Write] = {
    val comments = List.range(1, 11).map(num =>
      Comment(id = Some(num),
        content = s" Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim " +
          s"id [$num] est laborum.",
        postId = 1))
    table ++= comments
  }
}