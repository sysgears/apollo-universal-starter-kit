package repositories

import common.slick.SchemaInitializer
import javax.inject.Inject
import model.google.GoogleAuthTable
import model.google.GoogleAuthTable.GoogleAuthTable
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class GoogleAuthSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext) extends SchemaInitializer[GoogleAuthTable] {

  override val name: String = GoogleAuthTable.name
  override val table = TableQuery[GoogleAuthTable]
}