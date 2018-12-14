package repositories.auth

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.oauth.github.GithubAuth
import model.oauth.github.GithubAuthTable.GithubAuthTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class GithubAuthRepository @Inject()(override val driver: JdbcProfile)
                                    (implicit executionContext: ExecutionContext) extends Repository[GithubAuth, Int](driver) {
  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[GithubAuthTable]
  type TableType = GithubAuthTable
}