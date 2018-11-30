package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.UserTable
import model.UserTable.UserTable
import slick.jdbc.SQLiteProfile.api._

class UserSchemaInitializer @Inject()(database: Database) extends SchemaInitializer[UserTable] {

  override val name: String = UserTable.name
  override val table = TableQuery[UserTable]
  override val db = database
}