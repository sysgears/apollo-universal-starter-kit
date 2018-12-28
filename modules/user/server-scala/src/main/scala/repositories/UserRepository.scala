package repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.User
import model.UserTable.UserTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile
import slick.jdbc.JdbcBackend.Database
import slick.lifted.ColumnOrdered
import slick.ast.Ordering

import scala.concurrent.ExecutionContext

class UserRepository @Inject()(override val driver: JdbcProfile, db: Database)
                              (implicit executionContext: ExecutionContext) extends Repository[User, Int](driver) {

  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[UserTable]
  type TableType = UserTable

  def findAll(usernameOrEmailFilter: Option[String],
              roleFilter: Option[String],
              isActiveFilter: Option[Boolean],
              orderingColumn: Option[String],
              orderDirection: Option[String]): DBIO[Seq[User]] = {
    val filteringQuery = tableQuery.filter(
      user =>
        usernameOrEmailFilter.map(usernameOrEmail =>
          user.email === usernameOrEmail || user.username === usernameOrEmail).getOrElse(LiteralColumn(true)) &&
          roleFilter.map(role => user.role === role).getOrElse(LiteralColumn(true)) &&
          isActiveFilter.map(isActive => user.isActive === isActive).getOrElse(LiteralColumn(true))
    )
    val sortingQuery = for {
      ordering <- orderDirection.map {
        case "asc" => Ordering(Ordering.Asc)
        case "desc" => Ordering(Ordering.Desc)
      }
      sortedResult <- orderingColumn.map {
        case "id" => filteringQuery.sortBy(user => ColumnOrdered(user.id, ordering)).result
        case "username" => filteringQuery.sortBy(user => ColumnOrdered(user.username, ordering)).result
        case "role" => filteringQuery.sortBy(user => ColumnOrdered(user.role, ordering)).result
        case "isActive" => filteringQuery.sortBy(user => ColumnOrdered(user.isActive, ordering)).result
        case "email" => filteringQuery.sortBy(user => ColumnOrdered(user.email, ordering)).result
      }
    } yield sortedResult

    sortingQuery.getOrElse(filteringQuery.result)
  }

  def findByUsernameOrEmail(usernameOrEmail: String): DBIO[Option[User]] =
    tableQuery.filter(user => user.email === usernameOrEmail || user.username === usernameOrEmail).result.headOption

  def findByEmail(email: String): DBIO[Option[User]] =
    tableQuery.filter(user => user.email === email).result.headOption
}