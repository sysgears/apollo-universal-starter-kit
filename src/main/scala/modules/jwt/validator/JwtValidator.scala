package modules.jwt.validator

import scala.util.Try

trait JwtValidator {
  def validate(token: String): Try[Exception]

  def isValid(token: String): Boolean
}
