package modules.jwt.validator

import javax.inject.{Inject, Named}
import pdi.jwt.Jwt
import pdi.jwt.algorithms.JwtHmacAlgorithm

import scala.util.Try

class JwtValidatorImpl @Inject()(@Named("jwt.secretKey") secretKey: String,
                                 algorithm: JwtHmacAlgorithm) extends JwtValidator {
  override def validate(token: String): Try[Unit] = {
    Try(Jwt.validate(token, secretKey, Seq(algorithm)))
  }

  override def isValid(token: String): Boolean = {
    Jwt.isValid(token, secretKey, Seq(algorithm))
  }
}