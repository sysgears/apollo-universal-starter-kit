package repositories

import com.byteslounge.slickrepo.repository.Repository
import com.byteslounge.slickrepo.scalaversion.JdbcProfile
import model.User
import slick.dbio.DBIO

abstract class UserRepository(override val driver: JdbcProfile) extends Repository[User, Int](driver) {
  def findOne(usernameOrEmail: String): DBIO[Option[User]]
}