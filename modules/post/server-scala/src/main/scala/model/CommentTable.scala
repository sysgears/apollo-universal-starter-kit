package model

import com.byteslounge.slickrepo.meta.Keyed
import slick.jdbc.JdbcProfile

object CommentTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "COMMENTS"

  /**
    * Defines entity fields for slick.
    */
  class CommentTable(tag: Tag) extends SlickTable[Comment](tag, name) with Keyed[Int] {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)

    def content = column[String]("CONTENT")

    def postId = column[Int]("POST_ID")

    def * = (id.?, content, postId).mapTo[Comment]
  }

}
