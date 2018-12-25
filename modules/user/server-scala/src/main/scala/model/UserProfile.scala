package model

import akka.japi.Option.Some
import com.byteslounge.slickrepo.meta.Entity

case class UserProfile(id: Option[Int] = None,
                       firstName: Option[String],
                       lastName: Option[String],
                       fullName: Option[String]) extends Entity[UserProfile, Int] {
  override def withId(id: Int): UserProfile = this.copy(id = Some(id))
}