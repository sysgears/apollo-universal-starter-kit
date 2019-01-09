package repositories

import common.slick.SchemaInitializer
import javax.inject.Inject
import model.{Comment, CommentTable}
import model.CommentTable.CommentTable

import scala.concurrent.ExecutionContext

class CommentSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext)
  extends SchemaInitializer[CommentTable] {

  import driver.api._

  override val name: String = CommentTable.name
  override val table = TableQuery[CommentTable]

  override def initData: driver.api.DBIOAction[_, driver.api.NoStream, Effect.Write] = {
    val comments = List
      .range(1, 21)
      .sorted
      .flatMap(
        postId =>
          List
            .range(1, 3)
            .map(
              commentId =>
                Comment(
                  id = Some(postId * commentId),
                  content = s"Comment title [$commentId] for post [$postId]",
                  postId = postId
              )
          )
      )
    table ++= comments
  }
}
