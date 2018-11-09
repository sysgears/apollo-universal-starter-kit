package modules.jwt

import scala.util.Try

class JwtImpl extends Jwt {
  override def encode(content: String): String = ???

  override def decode(token: String): Try[String] = ???

  override def validate(token: String): Try[Exception] = ???

  override def isValid(token: String): Boolean = ???
}