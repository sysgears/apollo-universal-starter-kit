package repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.{FilterUserInput, OrderByUserInput, User}
import model.UserTable.UserTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile
import slick.jdbc.JdbcBackend.Database
import slick.lifted.ColumnOrdered
import slick.ast.Ordering

import scala.concurrent.ExecutionContext

class UserRepository @Inject()(override val driver: JdbcProfile, db: Database)(
    implicit executionContext: ExecutionContext
) extends Repository[User, Int](driver) {

  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[UserTable]
  type TableType = UserTable

  def findAll(orderBy: Option[OrderByUserInput], filter: Option[FilterUserInput]): DBIO[Seq[User]] = {
    val filteringQuery = tableQuery.filter {
      user =>
        filter
          .map {
            filterVal =>
              filterVal.searchText
                .map {
                  usernameOrEmail =>
                    user.email === usernameOrEmail || user.username === usernameOrEmail
                }
                .getOrElse(LiteralColumn(true)) &&
              filterVal.role.map(user.role === _).getOrElse(LiteralColumn(true)) &&
              filterVal.isActive.map(user.isActive === _).getOrElse(LiteralColumn(true))
          }
          .getOrElse(LiteralColumn(true))
    }
    val sortingQuery = for {
      orderByVal <- orderBy
      ordering <- orderByVal.order.map {
        case "asc" => Ordering(Ordering.Asc)
        case "desc" => Ordering(Ordering.Desc)
      }
      sortedResult <- orderByVal.column.map {
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
