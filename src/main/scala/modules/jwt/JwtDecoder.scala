package modules.jwt

import scala.util.Try

trait JwtDecoder {
  def decode(token: String): Try[String]
}