package repositories.auth

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.oauth.linkedin.LinkedinAuthTable
import model.oauth.linkedin.LinkedinAuthTable.LinkedinAuthTable
import slick.jdbc.SQLiteProfile.api._

class LinkedinAuthSchemaInitializer @Inject()(database: Database) extends SchemaInitializer[LinkedinAuthTable] {

  override val name: String = LinkedinAuthTable.name
  override val table = TableQuery[LinkedinAuthTable]
  override val db = database
}