package modules.pagination.model

import slick.jdbc.SQLiteProfile.api.{Table => SlickTable, _}
import slick.lifted.Tag

case class Item(id: Option[Long] = None, description: String)

object Item extends ((Option[Long], String) => Item) {

  val name = "ITEMS"

  class Table(tag: Tag) extends SlickTable[Item](tag, name) {
    def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

    def description = column[String]("DESCRIPTION")

    def * = (id.?, description).mapTo[Item]
  }

}