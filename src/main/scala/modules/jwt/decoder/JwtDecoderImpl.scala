package modules.jwt.decoder

import scala.util.Try

class JwtDecoderImpl extends JwtDecoder {
  override def decode(token: String): Try[String] = ???
}