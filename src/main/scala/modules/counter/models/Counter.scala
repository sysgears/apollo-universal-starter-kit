package modules.counter.models

import core.slick.SchemaInitializer
import slick.lifted.Tag
import slick.jdbc.SQLiteProfile.api.{Table => SlickTable, _}
import slick.model.Column

case class Counter(id: Option[Int] = None, amount: Int)

object Counter extends ((Option[Int], Int) => Counter) {

  class Table(tag: Tag) extends SlickTable[Counter](tag, "COUNTERS") {
    val id = column[Int]("ID", O.PrimaryKey)
    val amount = column[Int]("AMOUNT")

    override def * = (id.?, amount).mapTo[Counter]
  }
}