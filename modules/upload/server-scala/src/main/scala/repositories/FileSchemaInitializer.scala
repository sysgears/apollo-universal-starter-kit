package repositories

import core.slick.{SchemaLoader, TableInitializer}
import javax.inject.Inject
import models.FileMetadataTable
import models.FileMetadataTable.FileMetadataTable
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

class FileSchemaInitializer @Inject()(database: Database)
  extends TableInitializer[FileMetadataTable](FileMetadataTable.name, TableQuery[FileMetadataTable], database)
    with SchemaLoader {
}