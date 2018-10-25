package core.models

class Error extends Exception

case class BadRequest(msg: String = "") extends Error