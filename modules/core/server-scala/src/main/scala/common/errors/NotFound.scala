package common.errors

case class NotFound(msg: String = "") extends Error(msg)
