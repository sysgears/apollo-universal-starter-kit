package errors

case class Unauthorized(msg: String = "") extends Error(msg)