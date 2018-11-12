package modules.jwt.encoder

import java.time.Duration

class JwtEncoderImpl extends JwtEncoder {
  override def encode(content: String): String = ???

  override def encode(content: String, expiration: Duration): String = ???
}