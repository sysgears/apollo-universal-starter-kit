package models

import com.byteslounge.slickrepo.meta.Keyed
import slick.jdbc.JdbcProfile

object FileMetadataTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "FILES"

  class FileMetadataTable(tag: Tag) extends SlickTable[FileMetadata](tag, name) with Keyed[Int] {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)

    def name = column[String]("NAME")

    def contentType = column[String]("CONTENT_TYPE")

    def size = column[Long]("SIZE")

    def path = column[String]("PATH")

    override def * = (id.?, name, contentType, size, path).mapTo[FileMetadata]
  }

}
