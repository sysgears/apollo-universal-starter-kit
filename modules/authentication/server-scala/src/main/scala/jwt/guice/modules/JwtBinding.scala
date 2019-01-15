package jwt.guice.modules

import jwt.decoder.{JwtDecoder, JwtDecoderImpl}
import jwt.encoder.{JwtEncoder, JwtEncoderImpl}
import jwt.model.JwtContent
import jwt.service.{JwtAuthService, JwtAuthServiceImpl}
import jwt.validator.{JwtValidator, JwtValidatorImpl}
import net.codingwell.scalaguice.ScalaModule

class JwtBinding extends ScalaModule {

  override def configure() {
    bind[JwtEncoder].to[JwtEncoderImpl]
    bind[JwtDecoder].to[JwtDecoderImpl]
    bind[JwtValidator].to[JwtValidatorImpl]
    bind[JwtAuthService[JwtContent]].to[JwtAuthServiceImpl]
  }

//  @Provides
//  def algorithm: JwtHmacAlgorithm = {
//    JwtAlgorithm.HS512
//  }
}
