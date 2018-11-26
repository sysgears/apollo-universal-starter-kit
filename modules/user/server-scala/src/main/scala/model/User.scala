package model

import slick.jdbc.SQLiteProfile.api.{Table => SlickTable, _}
import slick.lifted.Tag

case class User(id: Option[Int] = None,
                username: String,
                email: String,
                password: String,
                role: String,
                isActive: Boolean)

object User extends ((Option[Int], String, String, String, String, Boolean) => User) {

  val name = "USERS"

  class Table(tag: Tag) extends SlickTable[User](tag, name) {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)

    def username = column[String]("USERNAME", O.Unique)

    def email = column[String]("EMAIL", O.Unique)

    def password = column[String]("PASSWORD")

    def role = column[String]("ROLE")

    def isActive = column[Boolean]("IS_ACTIVE")

    def * = (id.?, username, email, password, role, isActive).mapTo[User]
  }

}