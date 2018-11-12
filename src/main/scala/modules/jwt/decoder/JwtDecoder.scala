package modules.jwt.decoder

import scala.util.Try

trait JwtDecoder {
  def decode(token: String): Try[String]
}
