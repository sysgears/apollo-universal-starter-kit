package repositories.auth

import common.slick.SchemaInitializer
import javax.inject.Inject
import model.CertificateAuthTable
import model.CertificateAuthTable.CertificateAuthTable
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class CertificateAuthSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext)
  extends SchemaInitializer[CertificateAuthTable] {

  override val name: String = CertificateAuthTable.name
  override val table = TableQuery[CertificateAuthTable]
}
