package model

case class ResetPasswordInput(token: String, password: String, passwordConfirmation: String)
