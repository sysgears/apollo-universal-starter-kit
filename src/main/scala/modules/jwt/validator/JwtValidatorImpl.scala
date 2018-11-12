package modules.jwt.validator

import scala.util.Try

class JwtValidatorImpl extends JwtValidator {
  override def validate(token: String): Try[Exception] = ???

  override def isValid(token: String): Boolean = ???
}