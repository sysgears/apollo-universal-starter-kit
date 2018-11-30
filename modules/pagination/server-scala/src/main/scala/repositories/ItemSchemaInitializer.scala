package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.ItemTable.ItemTable
import model.{Item, ItemTable}
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

/** @inheritdoc */
class ItemSchemaInitializer @Inject()(database: Database) extends SchemaInitializer[ItemTable] {

  /** @inheritdoc */
  override val name: String = ItemTable.name
  /** @inheritdoc */
  override val table = TableQuery[ItemTable]
  /** @inheritdoc */
  override val db = database

  /** @inheritdoc */
  override def seedDatabase(tableQuery: TableQuery[ItemTable]): DBIOAction[_, NoStream, Effect.Write] = {
    val items = List.range(1, 100).map(num => Item(Some(num), s"Item $num"))
    tableQuery ++= items
  }
}