package modules.jwt.config

import java.util.concurrent.TimeUnit

import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config

@Singleton
class JwtConfig @Inject()(config: Config) {
  val secret: String = config.getString("jwt.secretKey")
  val accessTokenExpiration: Long = config.getDuration("jwt.accessTokenExpiration", TimeUnit.MILLISECONDS)
  val refreshTokenExpiration: Long = config.getDuration("jwt.refreshTokenExpiration", TimeUnit.MILLISECONDS)
}
