package common.models

class Error extends Exception

case class InternalServerError(msg: String = "") extends Error