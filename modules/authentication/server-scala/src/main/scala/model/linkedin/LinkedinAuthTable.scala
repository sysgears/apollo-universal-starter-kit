package model.linkedin

import com.byteslounge.slickrepo.meta.Keyed
import model.UserTable.UserTable
import slick.jdbc.JdbcProfile

object LinkedinAuthTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "LINKEDIN_AUTH"

  class LinkedinAuthTable(tag: Tag) extends SlickTable[LinkedinAuth](tag, name) with Keyed[String] {

    def id = column[String]("LINKEDIN_ID", O.Unique)

    def displayName = column[String]("DISPLAY_NAME")

    def userId = column[Int]("USER_ID", O.Unique)

    def userFk =
      foreignKey("LINKEDIN_USER_ID_FK", userId, TableQuery[UserTable])(
        _.id,
        onUpdate = ForeignKeyAction.Restrict,
        onDelete = ForeignKeyAction.Cascade
      )

    def * = (id.?, displayName, userId).mapTo[LinkedinAuth]
  }

}
