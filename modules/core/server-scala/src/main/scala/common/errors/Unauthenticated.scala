package common.errors

case class Unauthenticated(msg: String = "") extends Error(msg)
