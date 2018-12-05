package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.{Post, PostTable}
import model.PostTable.PostTable
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class PostSchemaInitializer @Inject()(database: Database)
                                     (implicit executionContext: ExecutionContext) extends SchemaInitializer[PostTable] {

  override val name: String = PostTable.name
  override val table = TableQuery[PostTable]
  override val db = database

  override def seedDatabase(tableQuery: TableQuery[PostTable]): DBIOAction[_, NoStream, Effect.Write] = {
    val posts = List.range(1, 5).map(num =>
      Post(id = Some(num),
        title = s"Post title #[$num]",
        content = s"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt " +
          s"ut labore et dolore magna aliqua. $num")
    )
    tableQuery ++= posts
  }
}