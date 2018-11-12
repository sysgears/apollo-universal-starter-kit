package common.models

class Error extends Exception

case class InternalServerError(msg: String = "") extends Error

case class AmbigousResult(msg: String = "") extends Error

case class NotFound(msg: String = "") extends Error