package config

import com.google.inject.Inject
import com.typesafe.config.Config

class AuthConfig @Inject()(config: Config) {
  val confirmRegistrationRoute: String = config.getString("user.auth.confirmRegistrationRoute")
  val skipConfirmation: Boolean = config.getBoolean("user.auth.skipConfirmation")
}