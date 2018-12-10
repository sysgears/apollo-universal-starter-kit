package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.UserTable
import model.UserTable.UserTable
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class UserSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext) extends SchemaInitializer[UserTable] {

  override val context = executionContext
  override val name: String = UserTable.name
  override val table = TableQuery[UserTable]
}