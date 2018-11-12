package modules.jwt

import java.time.Duration

trait JwtEncoder {
  def encode(content: String): String

  def encode(content: String, expiration: Duration): String
}