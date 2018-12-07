package repositories.auth

import javax.inject.Inject
import model.oauth.GoogleAuth
import com.byteslounge.slickrepo.repository.Repository
import model.oauth.GoogleAuthTable.GoogleAuthTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class GoogleAuthRepository @Inject()(override val driver: JdbcProfile)
                                    (implicit executionContext: ExecutionContext) extends Repository[GoogleAuth, String](driver) {
  import driver.api._

  val pkType = implicitly[BaseTypedType[String]]
  val tableQuery = TableQuery[GoogleAuthTable]
  type TableType = GoogleAuthTable
}