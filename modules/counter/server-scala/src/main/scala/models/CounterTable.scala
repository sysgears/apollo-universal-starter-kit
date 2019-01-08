package models

import com.byteslounge.slickrepo.meta.Keyed
import slick.jdbc.JdbcProfile

object CounterTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "COUNTER"

  class CounterTable(tag: Tag) extends SlickTable[Counter](tag, name) with Keyed[Int] {

    def id = column[Int]("ID", O.PrimaryKey)

    def amount = column[Int]("AMOUNT")

    override def * = (id.?, amount).mapTo[Counter]
  }

}
