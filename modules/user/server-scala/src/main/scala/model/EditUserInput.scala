package model

case class EditUserInput(
    id: Int,
    username: String,
    role: String,
    isActive: Option[Boolean],
    email: String,
    password: Option[String],
    profile: Option[ProfileInput]
)
