package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.{Post, PostTable}
import model.PostTable.PostTable

import scala.concurrent.ExecutionContext

class PostSchemaInitializer @Inject()(implicit executionContext: ExecutionContext) extends SchemaInitializer[PostTable] {

  import driver.api._

  override val context = executionContext
  override val name: String = PostTable.name
  override val table = TableQuery[PostTable]

  override def seedDatabase(tableQuery: TableQuery[PostTable]): DBIOAction[_, NoStream, Effect.Write] = {
    val posts = List.range(1, 6).map(num =>
      Post(id = Some(num),
        title = s"Post title #[$num]",
        content = s"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt " +
          s"ut labore et dolore magna aliqua. $num")
    )
    tableQuery ++= posts
  }
}