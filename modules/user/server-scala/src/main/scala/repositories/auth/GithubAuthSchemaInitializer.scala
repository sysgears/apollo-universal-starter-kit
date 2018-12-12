package repositories.auth

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.oauth.github.GithubAuthTable
import model.oauth.github.GithubAuthTable.GithubAuthTable
import slick.jdbc.SQLiteProfile.api._

class GithubAuthSchemaInitializer @Inject()(database: Database) extends SchemaInitializer[GithubAuthTable] {

  override val name: String = GithubAuthTable.name
  override val table = TableQuery[GithubAuthTable]
  override val db = database
}