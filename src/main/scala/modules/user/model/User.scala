package modules.user.model

case class User(id: Option[Long],
                username: String,
                email: String)