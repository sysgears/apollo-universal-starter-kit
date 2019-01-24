package models

import java.sql.Timestamp

import akka.http.scaladsl.model.DateTime
import com.byteslounge.slickrepo.meta.Entity

case class MessageAttachment(
    id: Option[Int] = None,
    messageId: Int,
    name: String,
    contentType: String,
    size: Int,
    path: String,
    createdAt: Timestamp = new Timestamp(DateTime.now.clicks),
    updatedAt: Timestamp = new Timestamp(DateTime.now.clicks)
) extends Entity[MessageAttachment, Int] {

  override def withId(id: Int): MessageAttachment = this.copy(id = Some(id))
}
