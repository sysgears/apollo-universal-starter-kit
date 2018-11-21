package modules.pagination.model

import slick.jdbc.SQLiteProfile.api.{Table => SlickTable, _}
import slick.lifted.Tag

case class DataObject(id: Option[Long] = None, description: String)

object DataObject extends ((Option[Long], String) => DataObject) {

  val name = "DATA_OBJECTS"

  class Table(tag: Tag) extends SlickTable[DataObject](tag, name) {
    def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

    def description = column[String]("DESCRIPTION")

    def * = (id.?, description).mapTo[DataObject]
  }

}