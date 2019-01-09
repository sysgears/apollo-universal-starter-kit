package repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import model.CertificateAuth
import model.CertificateAuthTable.CertificateAuthTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class CertificateAuthRepository @Inject()(override val driver: JdbcProfile)(implicit executionContext: ExecutionContext)
  extends Repository[CertificateAuth, Int](driver) {
  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[CertificateAuthTable]
  type TableType = CertificateAuthTable
}
