package modules.jwt.guice.modules

import com.google.inject.Provides
import com.typesafe.config.Config
import javax.inject.Named
import modules.jwt.decoder.{JwtDecoder, JwtDecoderImpl}
import modules.jwt.encoder.{JwtEncoder, JwtEncoderImpl}
import modules.jwt.validator.{JwtValidator, JwtValidatorImpl}
import net.codingwell.scalaguice.ScalaModule
import pdi.jwt.JwtAlgorithm
import pdi.jwt.algorithms.JwtHmacAlgorithm

class JwtModule extends ScalaModule {

  override def configure() {
    bind[JwtEncoder].to[JwtEncoderImpl]
    bind[JwtDecoder].to[JwtDecoderImpl]
    bind[JwtValidator].to[JwtValidatorImpl]
  }

  @Provides
  def algorithm: JwtHmacAlgorithm = {
    JwtAlgorithm.HS512
  }

  @Provides
  @Named("jwt.secretKey")
  def secretKey(config: Config): String = {
    config.getString("jwt.secretKey")
  }
}