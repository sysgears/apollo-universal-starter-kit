package config

import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config

@Singleton
class AuthConfig @Inject()(config: Config) {
  val confirmRegistrationRoute: String = config.getString("user.auth.confirmRegistrationRoute")
  val skipConfirmation: Boolean = config.getBoolean("user.auth.skipConfirmation")

  object google {
    val clientId: String = config.getString("user.auth.google.clientId")
    val clientSecret: String = config.getString("user.auth.google.clientSecret")
    val state: String = config.getString("user.auth.google.state")
    val scope: String = config.getString("user.auth.google.scope")
    val callback: String = config.getString("user.auth.google.callback")
  }
}