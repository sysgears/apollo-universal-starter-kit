package modules.jwt.validator

import javax.inject.Inject
import pdi.jwt.Jwt
import pdi.jwt.algorithms.JwtHmacAlgorithm

import scala.util.Try

class JwtValidatorImpl @Inject()(algorithm: JwtHmacAlgorithm) extends JwtValidator {

  override def validate(token: String, secret: String): Try[Boolean] =
    Try(Jwt.validate(token, secret, Seq(algorithm))).map(_ => true)
}