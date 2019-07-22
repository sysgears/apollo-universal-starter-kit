package repositories

import common.slick.SchemaInitializer
import javax.inject.Inject
import models.FileMetadataTable
import models.FileMetadataTable.FileMetadataTable

import scala.concurrent.ExecutionContext

class FileSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext)
  extends SchemaInitializer[FileMetadataTable] {

  import driver.api._

  override val name: String = FileMetadataTable.name
  override val table = TableQuery[FileMetadataTable]
}
