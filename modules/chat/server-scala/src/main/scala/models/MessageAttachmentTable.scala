package models

import java.sql.Timestamp

import com.byteslounge.slickrepo.meta.Keyed
import slick.jdbc.JdbcProfile

object MessageAttachmentTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "MESSAGE_ATTACHMENTS"

  class MessageAttachmentTable(tag: Tag) extends SlickTable[MessageAttachment](tag, name) with Keyed[Int] {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)

    def messageId = column[Int]("MESSAGE_ID")

    def name = column[String]("NAME")

    def contentType = column[String]("CONTENT_TYPE")

    def size = column[Int]("SIZE")

    def path = column[String]("PATH")

    def createdAt = column[Timestamp]("CREATED_AT")

    def updatedAt = column[Timestamp]("UPDATED_AT")

    override def * = (id.?, messageId, name, contentType, size, path, createdAt, updatedAt).mapTo[MessageAttachment]
  }

}
