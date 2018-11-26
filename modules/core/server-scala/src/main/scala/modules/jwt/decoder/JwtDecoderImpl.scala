package modules.jwt.decoder

import javax.inject.Inject
import pdi.jwt.Jwt
import pdi.jwt.algorithms.JwtHmacAlgorithm

import scala.util.Try

class JwtDecoderImpl @Inject()(algorithm: JwtHmacAlgorithm) extends JwtDecoder {

  override def decode(token: String): Try[String] = Jwt.decodeRaw(token)

  override def decode(token: String, secret: String): Try[String] = Jwt.decodeRaw(token, secret, Seq(algorithm))
}