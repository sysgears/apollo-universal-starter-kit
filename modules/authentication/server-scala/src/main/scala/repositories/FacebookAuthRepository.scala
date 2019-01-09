package repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.facebook.FacebookAuth
import model.facebook.FacebookAuthTable.FacebookAuthTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class FacebookAuthRepository @Inject()(override val driver: JdbcProfile)(implicit executionContext: ExecutionContext)
  extends Repository[FacebookAuth, String](driver) {
  import driver.api._

  val pkType = implicitly[BaseTypedType[String]]
  val tableQuery = TableQuery[FacebookAuthTable]
  type TableType = FacebookAuthTable

  def findOne(userId: Int): DBIO[Option[FacebookAuth]] =
    tableQuery.filter(fbAuth => fbAuth.userId === userId).result.headOption
}
