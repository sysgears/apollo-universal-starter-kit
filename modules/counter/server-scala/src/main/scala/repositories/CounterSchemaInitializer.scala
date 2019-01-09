package repositories

import common.slick.SchemaInitializer
import javax.inject.Inject
import models.CounterTable.CounterTable
import models.{Counter, CounterTable}

import scala.concurrent.ExecutionContext

class CounterSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext)
  extends SchemaInitializer[CounterTable] {

  import driver.api._

  override val name: String = CounterTable.name
  override val table = TableQuery[CounterTable]

  override def initData: DBIOAction[_, NoStream, Effect.Write] = {
    table ++= Seq(Counter(Some(1), 0))
  }
}
