package common.errors

case class InternalServerError(msg: String = "") extends Error(msg)