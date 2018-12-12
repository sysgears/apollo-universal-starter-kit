package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import models.CounterTable.CounterTable
import models.{Counter, CounterTable}

import scala.concurrent.ExecutionContext

class CounterSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext) extends SchemaInitializer[CounterTable] {

  import driver.api._

  override val context = executionContext
  override val name: String = CounterTable.name
  override val table = TableQuery[CounterTable]

  override def seedDatabase(tableQuery: TableQuery[CounterTable]): DBIOAction[_, NoStream, Effect.Write] = {
    tableQuery += Counter(Some(1), 0)
  }
}