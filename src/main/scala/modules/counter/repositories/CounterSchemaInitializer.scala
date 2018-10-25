package modules.counter.repositories

import core.guice.modules.Database
import core.slick.{SchemaInitializer, SchemaUtil}
import javax.inject.Inject
import modules.counter.models.Counter
import slick.lifted.TableQuery
import slick.driver.SQLiteDriver.api._

import scala.concurrent.{ExecutionContext, Future}

class CounterSchemaInitializer @Inject()(database: Database)
                                        (implicit executionContext: ExecutionContext) extends SchemaInitializer
  with SchemaUtil {

  val counters: TableQuery[Counter.Table] = TableQuery[Counter.Table]

  val name = "COUNTERS"

  override def create(): Future[Unit] = {

    withTable(database, counters, name, _.isEmpty) {
      DBIO.seq(
        counters.schema.create,
        counters += Counter(Some(1), 0)
      )
    }
  }

  override def drop(): Future[Unit] = {
    withTable(database, counters, name, _.nonEmpty) {
      DBIO.seq(counters.schema.drop)
    }
  }
}