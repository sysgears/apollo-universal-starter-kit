package model

import slick.jdbc.SQLiteProfile.api.{Table => SlickTable, _}
import slick.lifted.Tag

case class Post(id: Int = 0,
                title: String,
                content: String,
                comments: Seq[Comment] = Seq.empty)

object Post extends ((Int, String, String, Seq[Comment]) => Post) {

  val name = "POSTS"

  class Table(tag: Tag) extends SlickTable[Post](tag, name) {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)

    def title = column[String]("TITLE")

    def content = column[String]("CONTENT")

    def * = (id, title, content).mapTo[Post]
  }

}
