package core.guice.modules

import com.typesafe.config.{Config, ConfigFactory}
import net.codingwell.scalaguice.ScalaModule

class ConfigModule extends ScalaModule {

  override def configure() {
    bind[Config].toInstance(ConfigFactory.load)
  }
}