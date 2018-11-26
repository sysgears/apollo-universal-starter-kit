package model

import slick.jdbc.SQLiteProfile.api.{Table => SlickTable, _}
import slick.lifted.Tag

case class User(id: Option[Int] = None,
                username: String,
                email: String,
                password: String)

object User extends ((Option[Int], String, String, String) => User) {

  val name = "USERS"

  class Table(tag: Tag) extends SlickTable[User](tag, name) {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc)

    def username = column[String]("USERNAME")

    def email = column[String]("EMAIL")

    def password = column[String]("PASSWORD")

    def * = (id.?, username, email, password).mapTo[User]
  }

}