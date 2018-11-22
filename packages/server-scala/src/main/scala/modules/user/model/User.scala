package modules.user.model

import akka.japi.Option.Some
import com.byteslounge.slickrepo.meta.Entity

case class User(id: Option[Int] = None,
                username: String,
                email: String,
                password: String) extends Entity[User, Int] {
  override def withId(id: Int): User = this.copy(id = Some(id))
}