package repositories

import core.slick.TableInitializer
import javax.inject.Inject
import models.FileMetadataTable
import models.FileMetadataTable.FileMetadataTable
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

class FileSchemaInitializer @Inject()(database: Database) extends TableInitializer[FileMetadataTable]{

  override val name: String = FileMetadataTable.name
  override val table = TableQuery[FileMetadataTable]
  override val db = database
}