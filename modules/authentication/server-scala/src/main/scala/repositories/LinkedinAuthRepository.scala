package repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.linkedin.LinkedinAuth
import model.linkedin.LinkedinAuthTable.LinkedinAuthTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class LinkedinAuthRepository @Inject()(override val driver: JdbcProfile)
                                      (implicit executionContext: ExecutionContext) extends Repository[LinkedinAuth, String](driver) {
  import driver.api._

  val pkType = implicitly[BaseTypedType[String]]
  val tableQuery = TableQuery[LinkedinAuthTable]
  type TableType = LinkedinAuthTable

  def findOne(userId: Int): DBIO[Option[LinkedinAuth]] =
    tableQuery.filter(lnAuth => lnAuth.userId === userId).result.headOption
}