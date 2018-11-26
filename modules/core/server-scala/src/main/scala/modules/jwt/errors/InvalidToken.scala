package modules.jwt.errors

case class InvalidToken(msg: String = "") extends Error(msg)