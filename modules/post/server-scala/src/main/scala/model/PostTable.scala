package model

import com.byteslounge.slickrepo.meta.Keyed
import slick.jdbc.JdbcProfile

object PostTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "POSTS"

  /**
    * Defines entity fields for slick.
    */
  class PostTable(tag: Tag) extends SlickTable[Post](tag, name) with Keyed[Int] {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)

    def title = column[String]("TITLE")

    def content = column[String]("CONTENT")

    def * = (id.?, title, content).mapTo[Post]
  }

}
