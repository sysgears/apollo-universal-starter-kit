package modules.upload.graphql.resolvers

import akka.http.scaladsl.model.Multipart.FormData
import akka.stream.scaladsl.Source
import modules.upload.models.FileMetadata

import scala.concurrent.Future

trait FileUploadResolver {

  def uploadFiles(parts: Source[FormData.BodyPart, Any]): Future[Boolean]

  def files: Future[List[FileMetadata]]
  
  def removeFile(id: Int): Future[Boolean]
}