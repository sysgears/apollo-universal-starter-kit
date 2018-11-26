package modules.counter.models

import slick.jdbc.SQLiteProfile.api.{Table => SlickTable, _}
import slick.lifted.Tag

case class Counter(id: Option[Int] = None, amount: Int)

object Counter extends ((Option[Int], Int) => Counter) {

  val name = "COUNTER"

  class Table(tag: Tag) extends SlickTable[Counter](tag, name) {
    val id = column[Int]("ID", O.PrimaryKey)
    val amount = column[Int]("AMOUNT")

    override def * = (id.?, amount).mapTo[Counter]
  }
}