package modules.jwt.encoder

trait JwtEncoder {
  def encode(content: String, secret: String): String

  def encode(content: String, secret: String, expiration: Long): String
}