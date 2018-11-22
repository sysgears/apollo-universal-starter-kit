package modules.upload.repositories

import core.slick.{SchemaInitializer, SchemaUtil}
import javax.inject.Inject
import modules.upload.models.FileMetadataTable
import modules.upload.models.FileMetadataTable.FileMetadataTable
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.{ExecutionContext, Future}

class FileSchemaInitializer @Inject()(database: Database)
                                     (implicit executionContext: ExecutionContext) extends SchemaInitializer
  with SchemaUtil {

  val files: TableQuery[FileMetadataTable] = TableQuery[FileMetadataTable]

  override def create(): Future[Unit] = {
    withTable(database, files, FileMetadataTable.name, _.isEmpty) {
      DBIO.seq(
        files.schema.create,
      )
    }
  }

  override def drop(): Future[Unit] = {
    withTable(database, files, FileMetadataTable.name, _.nonEmpty) {
      DBIO.seq(files.schema.drop)
    }
  }
}