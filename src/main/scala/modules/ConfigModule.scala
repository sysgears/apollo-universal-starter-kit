package modules

import com.google.inject.{AbstractModule, Provides}
import com.typesafe.config.{Config, ConfigFactory}
import javax.inject.Singleton
import net.codingwell.scalaguice.ScalaModule

class ConfigModule extends AbstractModule with ScalaModule {

  @Provides
  @Singleton
  def config: Config = {
    ConfigFactory.load()
  }
}