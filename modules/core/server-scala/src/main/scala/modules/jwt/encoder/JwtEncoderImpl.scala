package modules.jwt.encoder

import javax.inject.Inject
import pdi.jwt.algorithms.JwtHmacAlgorithm
import pdi.jwt.{Jwt, JwtClaim}

/**
  * Default implementation of JwtEncoder, using the HMAC algorithm to encode secret.
  *
  * @param algorithm injected implementation of HMAC algorithm
  */
class JwtEncoderImpl @Inject()(algorithm: JwtHmacAlgorithm) extends JwtEncoder {

  /** @inheritdoc */
  override def encode(content: String, secret: String): String = Jwt.encode(JwtClaim(content), secret, algorithm)

  /** @inheritdoc */
  override def encode(content: String, secret: String, expiration: Long): String =
    Jwt.encode(JwtClaim(content).issuedNow.expiresIn(expiration), secret, algorithm)
}