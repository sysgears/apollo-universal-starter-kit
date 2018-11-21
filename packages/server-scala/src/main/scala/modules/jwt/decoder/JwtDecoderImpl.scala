package modules.jwt.decoder

import javax.inject.{Inject, Named}
import pdi.jwt.Jwt
import pdi.jwt.algorithms.JwtHmacAlgorithm

import scala.util.Try

class JwtDecoderImpl @Inject()(@Named("jwt.secretKey") secretKey: String,
                               algorithm: JwtHmacAlgorithm) extends JwtDecoder {
  override def decode(token: String): Try[String] = {
    Jwt.decodeRaw(token, secretKey, Seq(algorithm))
  }
}