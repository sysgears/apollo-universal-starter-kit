package models

import com.byteslounge.slickrepo.meta.Entity
import spray.json.{DefaultJsonProtocol, DeserializationException, JsArray, JsNumber, JsString, JsValue, RootJsonFormat}

case class FileMetadata(id: Option[Int] = None,
                        name: String,
                        contentType: String,
                        size: Long,
                        path: String) extends Entity[FileMetadata, Int] {
  override def withId(id: Int): FileMetadata = this.copy(id = Some(id))
}

object FileMetadataJsonProtocol extends DefaultJsonProtocol {

  implicit object FileMetadataFormat extends RootJsonFormat[FileMetadata] {
    def write(response: FileMetadata) = JsArray(
      JsNumber(response.id.get),
      JsString(response.name),
      JsString(response.contentType),
      JsNumber(response.size),
      JsString(response.path))

    def read(value: JsValue): FileMetadata = value.asJsObject.getFields("id", "name", "type", "size", "path") match {
      case Seq(JsNumber(id), JsString(name), JsString(contentType), JsNumber(size), JsString(path)) =>
        FileMetadata(Some(id.toInt), name, contentType, size.toInt, path)
      case _ => throw DeserializationException("FileMetadata expected")
    }
  }

}