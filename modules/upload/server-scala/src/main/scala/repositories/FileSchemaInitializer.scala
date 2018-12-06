package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import models.FileMetadataTable
import models.FileMetadataTable.FileMetadataTable
import slick.jdbc.JdbcBackend.Database
import slick.jdbc.JdbcProfile
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class FileSchemaInitializer @Inject()(driver: JdbcProfile,
                                      db: Database,
                                      executionContext: ExecutionContext) extends SchemaInitializer[FileMetadataTable](driver, db, executionContext){

  override val name: String = FileMetadataTable.name
  override val table = TableQuery[FileMetadataTable]
}