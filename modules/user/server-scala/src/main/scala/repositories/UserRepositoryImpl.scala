package repositories

import common.errors.AmbigousResult
import javax.inject.Inject
import model.User
import model.UserTable.UserTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile
import slick.jdbc.JdbcBackend.Database

import scala.concurrent.ExecutionContext

class UserRepositoryImpl @Inject()(override val driver: JdbcProfile, db: Database)
                                  (implicit executionContext: ExecutionContext) extends UserRepository(driver) {

  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[UserTable]
  type TableType = UserTable

  override def findOne(usernameOrEmail: String): DBIO[Option[User]] = for {
    users <- tableQuery.filter(user => user.email === usernameOrEmail || user.username === usernameOrEmail).result
    user <- if (users.lengthCompare(2) < 0) DBIO.successful(users.headOption) else DBIO.failed(AmbigousResult(s"User with username or email = $usernameOrEmail"))
  } yield user
}