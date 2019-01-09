package model.facebook

import com.byteslounge.slickrepo.meta.Keyed
import model.UserTable.UserTable
import slick.jdbc.JdbcProfile

object FacebookAuthTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "FACEBOOK_AUTH"

  class FacebookAuthTable(tag: Tag) extends SlickTable[FacebookAuth](tag, name) with Keyed[String] {

    def id = column[String]("FACEBOOK_ID", O.Unique)

    def displayName = column[String]("DISPLAY_NAME")

    def userId = column[Int]("USER_ID", O.Unique)

    def userFk =
      foreignKey("FACEBOOK_USER_ID_FK", userId, TableQuery[UserTable])(
        _.id,
        onUpdate = ForeignKeyAction.Restrict,
        onDelete = ForeignKeyAction.Cascade
      )

    def * = (id.?, displayName, userId).mapTo[FacebookAuth]
  }

}
