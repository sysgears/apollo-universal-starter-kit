package model.google

import akka.japi.Option.Some
import com.byteslounge.slickrepo.meta.Entity

case class GoogleAuth(id: Option[String], displayName: String, userId: Int) extends Entity[GoogleAuth, String] {

  override def withId(id: String): GoogleAuth = this.copy(id = Some(id))
}
