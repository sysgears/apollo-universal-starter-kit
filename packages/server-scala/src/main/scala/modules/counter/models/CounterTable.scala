package modules.counter.models

import com.byteslounge.slickrepo.meta.Keyed
import modules.counter.models.CounterTable.name
import slick.jdbc.SQLiteProfile.api.{Table => SlickTable, _}
import slick.lifted.Tag

class CounterTable(tag: Tag) extends SlickTable[Counter](tag, name) with Keyed[Int] {
  def id = column[Int]("ID", O.PrimaryKey)

  def amount = column[Int]("AMOUNT")

  override def * = (id.?, amount).mapTo[Counter]
}

object CounterTable {
  val name = "COUNTER"
}