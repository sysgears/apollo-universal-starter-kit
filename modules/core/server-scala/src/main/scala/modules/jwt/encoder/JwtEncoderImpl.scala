package modules.jwt.encoder

import javax.inject.Inject
import pdi.jwt.algorithms.JwtHmacAlgorithm
import pdi.jwt.{Jwt, JwtClaim}

class JwtEncoderImpl @Inject()(algorithm: JwtHmacAlgorithm) extends JwtEncoder {

  override def encode(content: String, secret: String): String = Jwt.encode(JwtClaim(content), secret, algorithm)

  override def encode(content: String, secret: String, expiration: Long): String =
    Jwt.encode(JwtClaim(content).issuedNow.expiresIn(expiration), secret, algorithm)
}