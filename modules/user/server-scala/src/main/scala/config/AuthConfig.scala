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

  object facebook {
    val clientId: String = config.getString("user.auth.facebook.clientId")
    val clientSecret: String = config.getString("user.auth.facebook.clientSecret")
    val state: String = config.getString("user.auth.facebook.state")
    val scope: String = config.getString("user.auth.facebook.scope")
    val callback: String = config.getString("user.auth.facebook.callback")
  }

  object github {
    val clientId: String = config.getString("user.auth.github.clientId")
    val clientSecret: String = config.getString("user.auth.github.clientSecret")
    val state: String = config.getString("user.auth.github.state")
    val scope: String = config.getString("user.auth.github.scope")
    val callback: String = config.getString("user.auth.github.callback")
  }

  object linkedin {
    val clientId: String = config.getString("user.auth.linkedin.clientId")
    val clientSecret: String = config.getString("user.auth.linkedin.clientSecret")
    val state: String = config.getString("user.auth.linkedin.state")
    val scope: String = config.getString("user.auth.linkedin.scope")
    val callback: String = config.getString("user.auth.linkedin.callback")
  }

}