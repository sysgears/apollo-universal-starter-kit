package config

import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config

@Singleton
class AuthConfig @Inject()(config: Config) {
  val confirmRegistrationRoute: String = config.getString("user.auth.confirmRegistrationRoute")
  val skipConfirmation: Boolean = config.getBoolean("user.auth.skipConfirmation")
}