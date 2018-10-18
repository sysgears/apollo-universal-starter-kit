package modules

import com.google.inject.AbstractModule
import com.typesafe.config.{Config, ConfigFactory}
import net.codingwell.scalaguice.ScalaModule

class ConfigModule extends AbstractModule with ScalaModule {

  override def configure() {
    bind[Config].toInstance(ConfigFactory.load)
  }
}