package models

import com.byteslounge.slickrepo.meta.Entity
import spray.json.{DefaultJsonProtocol, JsonFormat}

case class FileMetadata(id: Option[Int] = None,
                        name: String,
                        contentType: String,
                        size: Long,
                        path: String) extends Entity[FileMetadata, Int] {
  override def withId(id: Int): FileMetadata = this.copy(id = Some(id))
}

object FileMetadataJsonProtocol extends DefaultJsonProtocol {
  implicit val fileMetadataFormat: JsonFormat[FileMetadata] = jsonFormat5(FileMetadata)
}