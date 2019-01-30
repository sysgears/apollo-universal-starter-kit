package model.facebook

import com.byteslounge.slickrepo.meta.Entity

case class FacebookAuth(id: Option[String], displayName: String, userId: Int) extends Entity[FacebookAuth, String] {

  override def withId(id: String): FacebookAuth = this.copy(id = Some(id))
}
