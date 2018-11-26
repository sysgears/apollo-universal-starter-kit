package modules.pagination.repositories

import core.slick.{SchemaInitializer, SchemaUtil}
import javax.inject.Inject
import modules.pagination.model.Item
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.{ExecutionContext, Future}

class ItemSchemaInitializer @Inject()(database: Database)
                                     (implicit executionContext: ExecutionContext) extends SchemaInitializer with SchemaUtil {

  val items: TableQuery[Item.Table] = TableQuery[Item.Table]

  override def create(): Future[Unit] = {
    withTable(database, items, Item.name, _.isEmpty) {
      DBIO.seq(items.schema.create,
        items ++= seedDatabase
      )
    }
  }

  override def drop(): Future[Unit] = {
    withTable(database, items, Item.name, _.nonEmpty) {
      DBIO.seq(items.schema.drop)
    }
  }

  def seedDatabase: List[Item] = {
    List.range(1, 100).map(num => Item(Some(num), s"Item $num"))
  }
}