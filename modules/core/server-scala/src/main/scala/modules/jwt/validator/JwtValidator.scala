package modules.jwt.validator

import scala.util.Try

trait JwtValidator {
  def validate(token: String, secret: String): Try[Boolean]
}