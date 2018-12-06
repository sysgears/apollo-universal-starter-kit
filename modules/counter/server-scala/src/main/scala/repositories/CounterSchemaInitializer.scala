package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import models.{Counter, CounterTable}
import models.CounterTable.CounterTable
import slick.jdbc.JdbcBackend.Database
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class CounterSchemaInitializer @Inject()(driver: JdbcProfile,
                                         database: Database,
                                         executionContext: ExecutionContext) extends SchemaInitializer[CounterTable](driver, database, executionContext) {

  import slick.dbio.{DBIOAction, Effect, NoStream}
  import driver.api._

  override val name: String = CounterTable.name
  override val table = TableQuery[CounterTable]

  override def seedDatabase(tableQuery: TableQuery[CounterTable]): DBIOAction[_, NoStream, Effect.Write] = {
    tableQuery += Counter(Some(1), 0)
  }
}