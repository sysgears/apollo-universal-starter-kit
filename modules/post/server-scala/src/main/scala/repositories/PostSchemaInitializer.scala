package repositories

import common.slick.SchemaInitializer
import javax.inject.Inject
import model.{Post, PostTable}
import model.PostTable.PostTable

import scala.concurrent.ExecutionContext

class PostSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext)
  extends SchemaInitializer[PostTable] {

  import driver.api._

  override val name: String = PostTable.name
  override val table = TableQuery[PostTable]

  override def initData: driver.api.DBIOAction[_, driver.api.NoStream, Effect.Write] = {
    val posts = List
      .range(1, 21)
      .sorted
      .map(num => Post(id = Some(num), title = s"Post title [$num]", content = s"Post content [$num]"))
    table ++= posts
  }
}
