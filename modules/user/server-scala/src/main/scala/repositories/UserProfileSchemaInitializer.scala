package repositories

import common.slick.SchemaInitializer
import javax.inject.Inject
import model.UserProfileTable.UserProfileTable
import model.UserProfileTable
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class UserProfileSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext) extends SchemaInitializer[UserProfileTable] {

  override val context = executionContext
  override val name: String = UserProfileTable.name
  override val table = TableQuery[UserProfileTable]
}