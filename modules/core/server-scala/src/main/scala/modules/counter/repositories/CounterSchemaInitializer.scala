package modules.counter.repositories

import core.slick.TableInitializer
import javax.inject.Inject
import modules.counter.models.CounterTable.CounterTable
import modules.counter.models.{Counter, CounterTable}
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

class CounterSchemaInitializer @Inject()(database: Database) extends TableInitializer[CounterTable] {

  override val name: String = CounterTable.name
  override val table = TableQuery[CounterTable]
  override val db = database

  override def seedDatabase(tableQuery: TableQuery[CounterTable]): DBIOAction[_, NoStream, Effect.Write] = {
    tableQuery += Counter(Some(1), 1)
  }
}