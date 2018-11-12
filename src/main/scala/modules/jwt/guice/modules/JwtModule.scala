package modules.jwt.guice.modules

import modules.jwt.decoder.{JwtDecoder, JwtDecoderImpl}
import modules.jwt.encoder.{JwtEncoder, JwtEncoderImpl}
import modules.jwt.validator.{JwtValidator, JwtValidatorImpl}
import net.codingwell.scalaguice.ScalaModule

class JwtModule extends ScalaModule {

  override def configure() {
    bind[JwtEncoder].to[JwtEncoderImpl]
    bind[JwtDecoder].to[JwtDecoderImpl]
    bind[JwtValidator].to[JwtValidatorImpl]
  }
}