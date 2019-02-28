package repositories

import com.google.inject.Inject
import common.slick.SchemaInitializer
import models.DbMessageTable
import models.DbMessageTable.DbMessageTable

import scala.concurrent.ExecutionContext

class DbMessageSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext)
  extends SchemaInitializer[DbMessageTable] {

  import driver.api._

  override val name: String = DbMessageTable.name
  override val table = TableQuery[DbMessageTable]
}
