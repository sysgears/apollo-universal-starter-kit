package models

import java.sql.Timestamp

import akka.http.scaladsl.model.DateTime
import com.byteslounge.slickrepo.meta.Entity

case class DbMessage(
    id: Option[Int] = None,
    text: String,
    userId: Option[Int] = None,
    uuid: Option[String] = None,
    quotedId: Option[Int] = None,
    createdAt: Timestamp = new Timestamp(DateTime.now.clicks),
    updatedAt: Timestamp = new Timestamp(DateTime.now.clicks)
) extends Entity[DbMessage, Int] {

  override def withId(id: Int): DbMessage = this.copy(id = Some(id))
}
