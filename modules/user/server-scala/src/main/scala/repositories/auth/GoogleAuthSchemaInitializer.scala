package repositories.auth

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.oauth.google.GoogleAuthTable
import model.oauth.google.GoogleAuthTable.GoogleAuthTable
import slick.jdbc.SQLiteProfile.api._

class GoogleAuthSchemaInitializer @Inject()(database: Database) extends SchemaInitializer[GoogleAuthTable] {

  override val name: String = GoogleAuthTable.name
  override val table = TableQuery[GoogleAuthTable]
  override val db = database
}