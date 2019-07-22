package common.errors

case class AlreadyExists(msg: String = "") extends Error(msg)
