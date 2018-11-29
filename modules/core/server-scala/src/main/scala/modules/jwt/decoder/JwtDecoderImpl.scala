package modules.jwt.decoder

import javax.inject.Inject
import pdi.jwt.{Jwt, JwtOptions}
import pdi.jwt.algorithms.JwtHmacAlgorithm

import scala.util.Try

/**
  * Default implementation of JwtDecoder, using the HMAC algorithm to encode secret.
  *
  * @param algorithm injected implementation of HMAC algorithm
  */
class JwtDecoderImpl @Inject()(algorithm: JwtHmacAlgorithm) extends JwtDecoder {

  override def decode(token: String): Try[String] = Jwt.decodeRaw(token, JwtOptions(signature = false))

  override def decode(token: String, secret: String): Try[String] = Jwt.decodeRaw(token, secret, Seq(algorithm))
}