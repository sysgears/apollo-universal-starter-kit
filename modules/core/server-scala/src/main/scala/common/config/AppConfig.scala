package common.config

import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config

@Singleton
class AppConfig @Inject()(config: Config) {
  val url: String = config.getString("app.url")
  val name: String = config.getString("app.name")
}
