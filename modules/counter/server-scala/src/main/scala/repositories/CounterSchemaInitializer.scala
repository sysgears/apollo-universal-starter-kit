package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import models.{Counter, CounterTable}
import models.CounterTable.CounterTable
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

class CounterSchemaInitializer @Inject()(database: Database) extends SchemaInitializer[CounterTable] {

  override val name: String = CounterTable.name
  override val table = TableQuery[CounterTable]
  override val db = database

  override def seedDatabase(tableQuery: TableQuery[CounterTable]): DBIOAction[_, NoStream, Effect.Write] = {
    tableQuery += Counter(Some(1), 0)
  }
}