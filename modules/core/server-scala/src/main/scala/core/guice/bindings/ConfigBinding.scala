package core.guice.bindings

import com.google.inject.{Provides, Singleton}
import com.typesafe.config.{Config, ConfigFactory}
import net.codingwell.scalaguice.ScalaModule

class ConfigBinding extends ScalaModule {

  @Provides
  @Singleton
  def config: Config = {
    ConfigFactory.load()
  }
}