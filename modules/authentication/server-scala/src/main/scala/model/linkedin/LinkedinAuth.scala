package model.linkedin

import akka.japi.Option.Some
import com.byteslounge.slickrepo.meta.Entity

case class LinkedinAuth(id: Option[String],
                        displayName: String,
                        userId: Int) extends Entity[LinkedinAuth, String] {

  override def withId(id: String): LinkedinAuth = this.copy(id = Some(id))
}