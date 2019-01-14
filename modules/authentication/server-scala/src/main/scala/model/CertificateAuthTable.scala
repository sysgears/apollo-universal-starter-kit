package model

import com.byteslounge.slickrepo.meta.Keyed
import model.UserTable.UserTable
import slick.jdbc.JdbcProfile

object CertificateAuthTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "CERTIFICATE_AUTH"

  class CertificateAuthTable(tag: Tag) extends SlickTable[CertificateAuth](tag, name) with Keyed[Int] {
    def id = column[Int]("ID", O.PrimaryKey)

    def userFk =
      foreignKey("CERTIFICATE_AUTH_USER_ID_FK", id, TableQuery[UserTable])(
        _.id,
        onUpdate = ForeignKeyAction.Restrict,
        onDelete = ForeignKeyAction.Cascade
      )

    def serial = column[String]("SERIAL")

    def * = (id.?, serial.?).mapTo[CertificateAuth]
  }

}
