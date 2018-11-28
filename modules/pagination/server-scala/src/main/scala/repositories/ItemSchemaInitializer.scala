package repositories

import core.slick.{SchemaLoader, TableInitializer}
import javax.inject.Inject
import model.ItemTable.ItemTable
import model.{Item, ItemTable}
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

/**
  * Contains methods for initializing and drop a database.
  *
  * @param database base in which operations will be performed
  */
class ItemSchemaInitializer @Inject()(database: Database)
  extends TableInitializer[ItemTable](ItemTable.name, TableQuery[ItemTable], database)
    with SchemaLoader {

  override def drop(): Future[Unit] = {
    withTable(database, items, ItemTable.name, _.nonEmpty) {
      DBIO.seq(items.schema.drop)
    }
  }

  /**
    * Helper method for generating 'Item' entities
    *
    * @return list of 'Item' entities
    */
  def seedDatabase: List[Item] = {
    List.range(1, 100).map(num => Item(Some(num), s"Item $num"))
  }
}