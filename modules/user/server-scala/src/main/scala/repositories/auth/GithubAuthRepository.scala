package repositories.auth

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.auth.github.GithubAuthTable.GithubAuthTable
import model.github.GithubAuth
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class GithubAuthRepository @Inject()(override val driver: JdbcProfile)(implicit executionContext: ExecutionContext)
  extends Repository[GithubAuth, Int](driver) {
  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[GithubAuthTable]
  type TableType = GithubAuthTable

  def findOne(userId: Int): DBIO[Option[GithubAuth]] =
    tableQuery.filter(ghAuth => ghAuth.userId === userId).result.headOption
}
