package modules.jwt.decoder

import scala.util.Try

/** Provide the main logic around the JWT decoding.
  *
  * @define token   a JSON Web Token as a Base64 url-safe encoded String which can be used inside an HTTP header
  * @define secret  an encoded String which can be used in a validation step
  * @define content a valid stringified JSON representing the content of the token claim
  *
  */
trait JwtDecoder {

  /** Decode token content without a signature validation.
    *
    * @return $content
    * @param token $token
    */
  def decode(token: String): Try[String]

  /** Decode token content with a signature validation.
    *
    * @return $content
    * @param token  $token
    * @param secret $secret
    */
  def decode(token: String, secret: String): Try[String]
}
