package model.oauth

import model.UserTable.UserTable
import slick.jdbc.JdbcProfile

object GoogleAuthTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "GOOGLE_AUTH"

  class GoogleAuthTable(tag: Tag) extends SlickTable[GoogleAuth](tag, name) {

    def googleId = column[String]("GOOGLE_ID", O.Unique)

    def displayName = column[String]("DISPLAY_NAME")

    def userId = column[Int]("USER_ID", O.Unique)

    def userFk = foreignKey("USER_ID_FK", userId, TableQuery[UserTable])(_.id, onUpdate=ForeignKeyAction.Restrict, onDelete=ForeignKeyAction.Cascade)

    def * = (googleId, displayName, userId).mapTo[GoogleAuth]
  }
}