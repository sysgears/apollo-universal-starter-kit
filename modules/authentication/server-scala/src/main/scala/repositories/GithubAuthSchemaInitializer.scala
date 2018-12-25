package repositories

import common.slick.SchemaInitializer
import javax.inject.Inject
import model.github.GithubAuthTable
import model.github.GithubAuthTable.GithubAuthTable
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class GithubAuthSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext) extends SchemaInitializer[GithubAuthTable] {

  override val name: String = GithubAuthTable.name
  override val table = TableQuery[GithubAuthTable]
}