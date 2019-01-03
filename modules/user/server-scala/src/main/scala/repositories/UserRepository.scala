package repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.User
import model.UserTable.UserTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile
import slick.jdbc.JdbcBackend.Database

import scala.concurrent.ExecutionContext

class UserRepository @Inject()(override val driver: JdbcProfile, db: Database)
                              (implicit executionContext: ExecutionContext) extends Repository[User, Int](driver) {

  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[UserTable]
  type TableType = UserTable

  def findByUsernameOrEmail(usernameOrEmail: String): DBIO[Option[User]] =
    tableQuery.filter(user => user.email === usernameOrEmail || user.username === usernameOrEmail).result.headOption

  def findByEmail(email: String): DBIO[Option[User]] =
    tableQuery.filter(user => user.email === email).result.headOption
}