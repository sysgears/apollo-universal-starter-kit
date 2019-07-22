package models

import akka.japi.Option.Some
import com.byteslounge.slickrepo.meta.Entity

case class Counter(id: Option[Int] = None, amount: Int) extends Entity[Counter, Int] {
  override def withId(id: Int): Counter = this.copy(id = Some(id))
}
