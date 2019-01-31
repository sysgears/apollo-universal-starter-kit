package model

import akka.japi.Option.Some
import com.byteslounge.slickrepo.meta.Entity

case class UserProfile(
    id: Option[Int] = None,
    firstName: Option[String] = None,
    lastName: Option[String] = None,
    fullName: Option[String] = None
) extends Entity[UserProfile, Int] {
  override def withId(id: Int): UserProfile = this.copy(id = Some(id))
}
