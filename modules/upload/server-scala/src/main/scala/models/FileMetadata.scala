package models

import slick.lifted.Tag
import slick.jdbc.SQLiteProfile.api.{Table => SlickTable, _}
import spray.json.{DefaultJsonProtocol, JsonFormat}

case class FileMetadata(id: Option[Int] = None,
                        name: String,
                        contentType: String,
                        size: Long,
                        path: String)

object FileMetadata extends ((Option[Int], String, String, Long, String) => FileMetadata) {

  val name = "FILES"

  class Table(tag: Tag) extends SlickTable[FileMetadata](tag, name) {

    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)

    def name = column[String]("NAME")

    def contentType = column[String]("CONTENT_TYPE")

    def size = column[Long]("SIZE")

    def path = column[String]("PATH")

    override def * = (id.?, name, contentType, size, path).mapTo[FileMetadata]
  }
}

object FileMetadataJsonProtocol extends DefaultJsonProtocol {
  implicit val fileMetadataFormat: JsonFormat[FileMetadata] = jsonFormat5(FileMetadata)
}