package common.errors

case class AlreadyDone(msg: String = "") extends Error(msg)