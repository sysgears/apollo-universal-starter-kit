package modules.jwt.validator

import scala.util.Try

trait JwtValidator {
  def validate(token: String): Try[Unit]

  def isValid(token: String): Boolean
}