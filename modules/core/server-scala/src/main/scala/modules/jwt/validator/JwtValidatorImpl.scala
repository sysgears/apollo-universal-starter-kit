package modules.jwt.validator

import javax.inject.Inject
import pdi.jwt.Jwt
import pdi.jwt.algorithms.JwtHmacAlgorithm

import scala.util.Try

/**
  * Default implementation of JwtValidator, using the HMAC algorithm to validate secret.
  *
  * @param algorithm injected implementation of HMAC algorithm
  */
class JwtValidatorImpl @Inject()(algorithm: JwtHmacAlgorithm) extends JwtValidator {

  /** @inheritdoc */
  override def validate(token: String, secret: String): Try[Boolean] =
    Try(Jwt.validate(token, secret, Seq(algorithm))).map(_ => true)
}
