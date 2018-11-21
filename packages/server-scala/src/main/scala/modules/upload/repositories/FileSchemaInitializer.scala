package modules.upload.repositories

import javax.inject.Inject

import core.slick.{SchemaInitializer, SchemaUtil}
import modules.upload.models.FileMetadata
import slick.lifted.TableQuery
import slick.jdbc.SQLiteProfile.api._

import scala.concurrent.{ExecutionContext, Future}

class FileSchemaInitializer @Inject()(database: Database)
                                     (implicit executionContext: ExecutionContext) extends SchemaInitializer
  with SchemaUtil {

  val files: TableQuery[FileMetadata.Table] = TableQuery[FileMetadata.Table]

  override def create(): Future[Unit] = {
    withTable(database, files, FileMetadata.name, _.isEmpty) {
      DBIO.seq(
        files.schema.create,
      )
    }
  }

  override def drop(): Future[Unit] = {
    withTable(database, files, FileMetadata.name, _.nonEmpty) {
      DBIO.seq(files.schema.drop)
    }
  }
}