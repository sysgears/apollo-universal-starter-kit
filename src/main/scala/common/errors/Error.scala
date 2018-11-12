package common.errors

class Error extends Exception

case class InternalServerError(msg: String = "") extends Error

case class AmbigousResult(msg: String = "") extends Error

case class AlreadyExists(msg: String = "") extends Error