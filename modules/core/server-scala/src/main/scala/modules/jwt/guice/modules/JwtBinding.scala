package modules.jwt.guice.modules

import com.google.inject.Provides
import modules.jwt.decoder.{JwtDecoder, JwtDecoderImpl}
import modules.jwt.encoder.{JwtEncoder, JwtEncoderImpl}
import modules.jwt.model.JwtContent
import modules.jwt.service.{JwtAuthService, JwtAuthServiceImpl}
import modules.jwt.validator.{JwtValidator, JwtValidatorImpl}
import net.codingwell.scalaguice.ScalaModule
import pdi.jwt.JwtAlgorithm
import pdi.jwt.algorithms.JwtHmacAlgorithm

class JwtBinding extends ScalaModule {

  override def configure() {
    bind[JwtEncoder].to[JwtEncoderImpl]
    bind[JwtDecoder].to[JwtDecoderImpl]
    bind[JwtValidator].to[JwtValidatorImpl]
    bind[JwtAuthService[JwtContent]].to[JwtAuthServiceImpl]
  }

  @Provides
  def algorithm: JwtHmacAlgorithm = {
    JwtAlgorithm.HS512
  }
}