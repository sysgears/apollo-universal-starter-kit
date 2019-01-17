package jwt.validator

import scala.util.Try

/** Provide the main logic around the JWT validation.
  *
  * @define token  a JSON Web Token as a Base64 url-safe encoded String which can be used inside an HTTP header
  * @define secret an encoded String which can be used in a validation step
  *
  */
trait JwtValidator {

  /** Validate token by signature, expiration and notBefore options.
    *
    * @return Try, which contains true if the token is valid or Exception if not
    * @param token $token
    */
  def validate(token: String, secret: String): Try[Boolean]
}
