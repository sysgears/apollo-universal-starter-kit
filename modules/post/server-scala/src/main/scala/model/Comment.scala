package model

import slick.jdbc.SQLiteProfile.api.{Table => SlickTable, _}
import slick.lifted.Tag

case class Comment(id: Int = 0,
                   content: String,
                   postId: Int)

object Comment extends ((Int, String, Int) => Comment) {

  val name = "COMMENTS"

  class Table(tag: Tag) extends SlickTable[Comment](tag, name) {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)

    def content = column[String]("CONTENT")

    def postId = column[Int]("POST_ID")

    def * = (id, content, postId).mapTo[Comment]
  }

}