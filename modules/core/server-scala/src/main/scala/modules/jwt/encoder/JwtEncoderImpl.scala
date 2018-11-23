package modules.jwt.encoder

import java.time.Duration

import javax.inject.{Inject, Named}
import pdi.jwt.algorithms.JwtHmacAlgorithm
import pdi.jwt.{Jwt, JwtClaim}

class JwtEncoderImpl @Inject()(@Named("jwt.secretKey") secretKey: String,
                               algorithm: JwtHmacAlgorithm) extends JwtEncoder {

  override def encode(content: String): String = {
    Jwt.encode(content, secretKey, algorithm)
  }

  override def encode(content: String, expiration: Duration): String = {
    Jwt.encode(JwtClaim(content).issuedNow.expiresIn(expiration.toMillis), secretKey, algorithm)
  }
}