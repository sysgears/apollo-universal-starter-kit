package modules.upload.repositories

import javax.inject.Singleton
import com.google.inject.Inject
import common.errors.{AlreadyExists, AmbigousResult, InternalServerError}
import modules.upload.models.FileMetadata
import slick.jdbc.SQLiteProfile.api._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

trait FileMetadataRepo {

  def create(fileMetadata: FileMetadata): Future[FileMetadata]

  def find(id: Int): Future[Option[FileMetadata]]

  def findAll: Future[List[FileMetadata]]

  def delete(id: Int): Future[Int]
}

@Singleton
class FileMetadataRepoImpl @Inject()(db: Database) extends FileMetadataRepo {

  val query: TableQuery[FileMetadata.Table] = TableQuery[FileMetadata.Table]

  override def create(file: FileMetadata): Future[FileMetadata] = db.run(Actions.create(file)) /*Future.failed(InternalServerError("smth went wrong"))*/

  override def find(id: Int): Future[Option[FileMetadata]] = db.run(Actions.find(id))

  override def findAll: Future[List[FileMetadata]] = db.run(Actions.findAll)
  
  override def delete(id: Int): Future[Int] = db.run(Actions.delete(id))

  object Actions {

    def find(id: Int): DBIO[Option[FileMetadata]] = for {
      files <- query.filter(_.id === id).result
      file <- if (files.lengthCompare(2) < 0) DBIO.successful(files.headOption) else DBIO.failed(AmbigousResult(s"FileMetadata with id = $id"))
    } yield file

    def create(fileMetadata: FileMetadata): DBIO[FileMetadata] = for {
      maybeFile <- if (fileMetadata.id.isEmpty) DBIO.successful(None) else find(fileMetadata.id.get)
      file <- maybeFile.fold[DBIO[FileMetadata]] {
        (query returning query.map(_.id)
          into ((file, id) => file.copy(id = Some(id)))
          ) += fileMetadata
      } {
        _ => DBIO.failed(AlreadyExists(s"FileMetadata with id = ${fileMetadata.id}"))
      }
    } yield file

    def findAll: DBIO[List[FileMetadata]] = query.result.map(_.toList)
    
    def delete(id: Int): DBIO[Int] = query.filter(_.id === id).delete
  }
}