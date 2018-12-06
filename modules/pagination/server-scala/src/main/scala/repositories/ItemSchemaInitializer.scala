package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.ItemTable.ItemTable
import model.{Item, ItemTable}
import slick.jdbc.JdbcBackend.Database
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

/** @inheritdoc */
class ItemSchemaInitializer @Inject()(driver: JdbcProfile,
                                      db: Database,
                                      executionContext: ExecutionContext) extends SchemaInitializer[ItemTable](driver, db, executionContext) {

  import slick.dbio.{DBIOAction, Effect, NoStream}
  import driver.api._

  /** @inheritdoc */
  override val name: String = ItemTable.name
  /** @inheritdoc */
  override val table = TableQuery[ItemTable]

  /** @inheritdoc */
  override def seedDatabase(tableQuery: TableQuery[ItemTable]): DBIOAction[_, NoStream, Effect.Write] = {
    val items = List.range(1, 100).map(num => Item(Some(num), s"Item $num"))
    tableQuery ++= items
  }
}