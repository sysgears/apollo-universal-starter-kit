package model

import com.byteslounge.slickrepo.meta.Keyed
import model.UserTable.UserTable
import slick.jdbc.JdbcProfile

object UserProfileTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "USER_PROFILE"

  class UserProfileTable(tag: Tag) extends SlickTable[UserProfile](tag, name) with Keyed[Int] {
    def id = column[Int]("ID", O.PrimaryKey)

    def userFk = foreignKey("PROFILE_USER_ID_FK", id, TableQuery[UserTable])(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

    def firstName = column[String]("FIRST_NAME")

    def lastName = column[String]("LAST_NAME")

    def fullName = column[String]("FULL_NAME")

    def * = (id.?, firstName.?, lastName.?, fullName.?).mapTo[UserProfile]
  }

}