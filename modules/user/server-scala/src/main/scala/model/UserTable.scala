package model

import com.byteslounge.slickrepo.meta.Keyed
import slick.jdbc.JdbcProfile

object UserTable extends JdbcProfile {

  import api.{Table => SlickTable, _}

  val name = "USERS"

  class UserTable(tag: Tag) extends SlickTable[User](tag, name) with Keyed[Int] {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)

    def username = column[String]("USERNAME")

    def email = column[String]("EMAIL")

    def password = column[String]("PASSWORD")

    def * = (id.?, username, email, password).mapTo[User]
  }

}
