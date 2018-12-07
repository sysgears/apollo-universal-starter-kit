package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.ItemTable.ItemTable
import model.{Item, ItemTable}
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

/** @inheritdoc */
class ItemSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext) extends SchemaInitializer[ItemTable] {

  override val context = executionContext

  /** @inheritdoc */
  override val name: String = ItemTable.name
  /** @inheritdoc */
  override val table = TableQuery[ItemTable]

  // TODO: need fix
//  /** @inheritdoc */
//  override def seedDatabase(tableQuery: TableQuery[ItemTable]): DBIOAction[_, NoStream, Effect.Write] = {
//    val items = List.range(1, 100).map(num => Item(Some(num), s"Item $num"))
//    tableQuery ++= items
//  }
}