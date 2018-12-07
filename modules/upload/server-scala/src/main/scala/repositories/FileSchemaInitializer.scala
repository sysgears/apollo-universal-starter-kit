package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import models.FileMetadataTable
import models.FileMetadataTable.FileMetadataTable
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class FileSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext) extends SchemaInitializer[FileMetadataTable]{

  override val context = executionContext
  override val name: String = FileMetadataTable.name
  override val table = TableQuery[FileMetadataTable]
}