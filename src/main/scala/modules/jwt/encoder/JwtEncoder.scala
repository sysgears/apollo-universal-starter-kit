package modules.jwt.encoder

import java.time.Duration

trait JwtEncoder {
  def encode(content: String): String

  def encode(content: String, expiration: Duration): String
}
