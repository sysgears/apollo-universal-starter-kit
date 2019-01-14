package model

case class AddUserWithAuthInput(
    username: String,
    email: String,
    password: String,
    role: String,
    isActive: Option[Boolean],
    profile: Option[ProfileInput],
    auth: Option[AuthInput]
)
