package models

import java.sql.Timestamp

import com.byteslounge.slickrepo.meta.Keyed
import slick.jdbc.JdbcProfile

object DbMessageTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "MESSAGES"

  class DbMessageTable(tag: Tag) extends SlickTable[DbMessage](tag, name) with Keyed[Int] {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)

    def text = column[String]("TEXT")

    def userId = column[Option[Int]]("USER_ID")

    def uuid = column[Option[String]]("UUID")

    def quotedId = column[Option[Int]]("QUOTED_ID")

    def createdAt = column[Timestamp]("CREATED_AT")

    def updatedAt = column[Timestamp]("UPDATED_AT")

    override def * = (id.?, text, userId, uuid, quotedId, createdAt, updatedAt).mapTo[DbMessage]
  }

}
