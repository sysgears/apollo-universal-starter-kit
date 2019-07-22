package jwt.encoder

/** Provide the main logic around the JWT encoding.
  *
  * @define token   a JSON Web Token as a Base64 url-safe encoded String which can be used inside an HTTP header
  * @define secret  an encoded String which can be used in a validation step
  * @define content a valid stringified JSON representing the content of the token claim
  *
  */
trait JwtEncoder {

  /** Encode token content without an expiration option.
    *
    * @return $token
    * @param content $content
    * @param secret  $secret
    */
  def encode(content: String, secret: String): String

  /** Encode token content with an expiration option.
    *
    * @return $token
    * @param content $content
    * @param secret  $secret
    */
  def encode(content: String, secret: String, expiration: Long): String
}
