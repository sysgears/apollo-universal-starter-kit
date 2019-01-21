package repositories.auth

import common.slick.SchemaInitializer
import javax.inject.Inject
import model.auth.google.GoogleAuthTable
import model.auth.google.GoogleAuthTable.GoogleAuthTable
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class GoogleAuthSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext)
  extends SchemaInitializer[GoogleAuthTable] {

  override val name: String = GoogleAuthTable.name
  override val table = TableQuery[GoogleAuthTable]
}
