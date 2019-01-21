package repositories.auth

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.auth.google.GoogleAuthTable.GoogleAuthTable
import model.google.GoogleAuth
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class GoogleAuthRepository @Inject()(override val driver: JdbcProfile)(implicit executionContext: ExecutionContext)
  extends Repository[GoogleAuth, String](driver) {
  import driver.api._

  val pkType = implicitly[BaseTypedType[String]]
  val tableQuery = TableQuery[GoogleAuthTable]
  type TableType = GoogleAuthTable

  def findOne(userId: Int): DBIO[Option[GoogleAuth]] =
    tableQuery.filter(gAuth => gAuth.userId === userId).result.headOption
}
