package model.oauth

import akka.japi.Option.Some
import com.byteslounge.slickrepo.meta.Entity

case class GoogleAuth(googleId: Option[String],
                      displayName: String,
                      userId: Int) extends Entity[GoogleAuth, String] {

  override def withId(id: String): GoogleAuth = this.copy(googleId = Some(id))

  override val id: Option[String] = googleId
}