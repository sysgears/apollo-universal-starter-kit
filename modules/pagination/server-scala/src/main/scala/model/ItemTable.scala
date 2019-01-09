package model

import com.byteslounge.slickrepo.meta.Keyed
import slick.jdbc.JdbcProfile

object ItemTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "ITEMS"

  /**
    * Defines entity fields for slick.
    */
  class ItemTable(tag: Tag) extends SlickTable[Item](tag, name) with Keyed[Int] {

    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)

    def description = column[String]("DESCRIPTION")

    override def * = (id.?, description).mapTo[Item]
  }

}
