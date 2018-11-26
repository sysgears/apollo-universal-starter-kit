package modules.jwt.validator

import javax.inject.Inject
import pdi.jwt.Jwt
import pdi.jwt.algorithms.JwtHmacAlgorithm

import scala.util.Try

class JwtValidatorImpl @Inject()(algorithm: JwtHmacAlgorithm) extends JwtValidator {

  override def validate(token: String, secret: String): Try[Unit] = Try(Jwt.validate(token, secret, Seq(algorithm)))

  override def isValid(token: String, secret: String): Boolean = Jwt.isValid(token, secret, Seq(algorithm))
}