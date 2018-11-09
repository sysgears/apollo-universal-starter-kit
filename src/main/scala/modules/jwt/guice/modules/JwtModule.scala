package modules.jwt.guice.modules

import modules.jwt.{Jwt, JwtImpl}
import net.codingwell.scalaguice.ScalaModule

class JwtModule extends ScalaModule {

  override def configure() {
    bind[Jwt].to[JwtImpl]
  }
}