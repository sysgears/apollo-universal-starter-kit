package model

import com.byteslounge.slickrepo.meta.Entity
import repositories.UserProfileRepository
import common.implicits.RichDBIO._

import scala.concurrent.{ExecutionContext, Future}

case class User(
    id: Option[Int] = None,
    username: String,
    email: String,
    password: String,
    role: String,
    isActive: Boolean
) extends Entity[User, Int] {
  override def withId(id: Int): User = this.copy(id = Some(id))

  def userProfile(
      userProfileRepository: UserProfileRepository
  )(implicit executionContext: ExecutionContext): Future[Option[UserProfile]] =
    userProfileRepository.findOne(id.get).run
}
