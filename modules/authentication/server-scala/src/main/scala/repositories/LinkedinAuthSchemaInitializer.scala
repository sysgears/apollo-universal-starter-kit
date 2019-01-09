package repositories

import common.slick.SchemaInitializer
import javax.inject.Inject
import model.linkedin.LinkedinAuthTable
import model.linkedin.LinkedinAuthTable.LinkedinAuthTable
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class LinkedinAuthSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext)
  extends SchemaInitializer[LinkedinAuthTable] {

  override val name: String = LinkedinAuthTable.name
  override val table = TableQuery[LinkedinAuthTable]
}
