package repositories.auth

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.oauth.FacebookAuth
import model.oauth.FacebookAuthTable.FacebookAuthTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class FacebookAuthRepository @Inject()(override val driver: JdbcProfile)
                                      (implicit executionContext: ExecutionContext) extends Repository[FacebookAuth, String](driver) {
  import driver.api._

  val pkType = implicitly[BaseTypedType[String]]
  val tableQuery = TableQuery[FacebookAuthTable]
  type TableType = FacebookAuthTable
}