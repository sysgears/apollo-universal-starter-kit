package model

import model.auth.AuthInput

case class AddUserInput(
    username: String,
    email: String,
    password: String,
    role: String,
    isActive: Option[Boolean],
    profile: Option[ProfileInput],
    auth: Option[AuthInput]
)
