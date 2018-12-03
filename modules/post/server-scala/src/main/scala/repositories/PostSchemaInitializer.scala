package repositories

import core.slick.{SchemaInitializer, SchemaUtil}
import javax.inject.Inject
import model.{Post, PostTable}
import model.PostTable.PostTable
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.{ExecutionContext, Future}

class PostSchemaInitializer @Inject()(database: Database)
                                     (implicit executionContext: ExecutionContext) extends SchemaInitializer
  with SchemaUtil {

  val posts: TableQuery[PostTable] = TableQuery[PostTable]

  override def create(): Future[Unit] = {
    withTable(database, posts, PostTable.name, _.isEmpty) {
      DBIO.seq(posts.schema.create,
        posts ++= fillDatabase)
    }
  }

  override def drop(): Future[Unit] = {
    withTable(database, posts, PostTable.name, _.nonEmpty) {
      DBIO.seq(posts.schema.drop)
    }
  }

  /**
    * Helper method for generating 'Post' entities
    *
    * @return list of 'Post' entities
    */
  def fillDatabase: List[Post] = {
    List.range(1, 5).map(num =>
      Post(id = Some(num),
        title = s"Post title #[$num]",
        content = s"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt " +
          s"ut labore et dolore magna aliqua. $num")
    )
  }
}