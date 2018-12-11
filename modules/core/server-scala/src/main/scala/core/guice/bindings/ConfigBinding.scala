package core.guice.bindings

import com.typesafe.config.{Config, ConfigFactory}
import net.codingwell.scalaguice.ScalaModule

class ConfigBinding extends ScalaModule {

  override def configure() {
    bind[Config].toInstance(ConfigFactory.load)
  }
}