package repositories.auth

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.oauth.github.GithubAuthTable
import model.oauth.github.GithubAuthTable.GithubAuthTable
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class GithubAuthSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext) extends SchemaInitializer[GithubAuthTable] {

  override val context = executionContext
  override val name: String = GithubAuthTable.name
  override val table = TableQuery[GithubAuthTable]
}