package model.github

import com.byteslounge.slickrepo.meta.Keyed
import model.UserTable.UserTable
import slick.jdbc.JdbcProfile

object GithubAuthTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "GITHUB_AUTH"

  class GithubAuthTable(tag: Tag) extends SlickTable[GithubAuth](tag, name) with Keyed[Int] {

    def id = column[Int]("GITHUB_ID", O.Unique)

    def displayName = column[String]("DISPLAY_NAME")

    def userId = column[Int]("USER_ID", O.Unique)

    def userFk = foreignKey("GITHUB_USER_ID_FK", userId, TableQuery[UserTable])(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

    def * = (id.?, displayName, userId).mapTo[GithubAuth]
  }

}
