package repositories.auth

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.oauth.facebook.FacebookAuthTable
import model.oauth.facebook.FacebookAuthTable.FacebookAuthTable
import slick.jdbc.SQLiteProfile.api._

class FacebookAuthSchemaInitializer @Inject()(database: Database) extends SchemaInitializer[FacebookAuthTable] {

  override val name: String = FacebookAuthTable.name
  override val table = TableQuery[FacebookAuthTable]
  override val db = database
}