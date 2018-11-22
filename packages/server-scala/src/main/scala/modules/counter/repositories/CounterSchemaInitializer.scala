package modules.counter.repositories

import core.slick.{SchemaInitializer, SchemaUtil}
import javax.inject.Inject
import modules.counter.models.{Counter, CounterTable}
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.{ExecutionContext, Future}

class CounterSchemaInitializer @Inject()(database: Database)
                                        (implicit executionContext: ExecutionContext) extends SchemaInitializer
  with SchemaUtil {

  val counters: TableQuery[CounterTable] = TableQuery[CounterTable]

  override def create(): Future[Unit] = {

    withTable(database, counters, CounterTable.name, _.isEmpty) {
      DBIO.seq(
        counters.schema.create,
        counters += Counter(Some(1), 0)
      )
    }
  }

  override def drop(): Future[Unit] = {
    withTable(database, counters, CounterTable.name, _.nonEmpty) {
      DBIO.seq(counters.schema.drop)
    }
  }
}