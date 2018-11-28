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

  //  TODO: fix implementation
  override def seedDatabase[ItemTable](tableQuery: TableQuery[ItemTable]) = {
    val items = List.range(1, 100).map(num => Item(Some(num), s"Item $num"))
    DBIO.successful()
  }
}