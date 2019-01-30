package model.auth.google

import com.byteslounge.slickrepo.meta.Keyed
import model.UserTable.UserTable
import model.google.GoogleAuth
import slick.jdbc.JdbcProfile

object GoogleAuthTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "GOOGLE_AUTH"

  class GoogleAuthTable(tag: Tag) extends SlickTable[GoogleAuth](tag, name) with Keyed[String] {

    def id = column[String]("GOOGLE_ID", O.Unique)

    def displayName = column[String]("DISPLAY_NAME")

    def userId = column[Int]("USER_ID", O.Unique)

    def userFk =
      foreignKey("GOOGLE_USER_ID_FK", userId, TableQuery[UserTable])(
        _.id,
        onUpdate = ForeignKeyAction.Restrict,
        onDelete = ForeignKeyAction.Cascade
      )

    def * = (id.?, displayName, userId).mapTo[GoogleAuth]
  }

}
