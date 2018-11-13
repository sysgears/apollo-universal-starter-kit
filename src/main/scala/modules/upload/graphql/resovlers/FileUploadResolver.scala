package modules.upload.graphql.resovlers

import akka.http.scaladsl.model.Multipart.FormData
import akka.stream.scaladsl.Source

import scala.concurrent.Future

trait FileUploadResolver {

  def upload(parts: Source[FormData.BodyPart, Any]): Future[Boolean]
}