package config

import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config

@Singleton
class MailConfig @Inject()(config: Config) {
  val address: String = config.getString("email.address")
}
