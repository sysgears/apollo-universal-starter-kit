package config

import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config

@Singleton
class AuthConfig @Inject()(config: Config) {
  val skipConfirmation: Boolean = config.getBoolean("skipConfirmation")
  val secret: String = config.getString("secret")
  val passwordMinLength: Int = config.getInt("password.minLength")

  object google {
    val clientId: String = config.getString("oauth2.google.clientId")
    val clientSecret: String = config.getString("oauth2.google.clientSecret")
    val state: String = config.getString("oauth2.google.state")
    val scope: String = config.getString("oauth2.google.scope")
    val callback: String = config.getString("oauth2.google.callback")
  }

  object facebook {
    val clientId: String = config.getString("oauth2.facebook.clientId")
    val clientSecret: String = config.getString("oauth2.facebook.clientSecret")
    val state: String = config.getString("oauth2.facebook.state")
    val scope: String = config.getString("oauth2.facebook.scope")
    val callback: String = config.getString("oauth2.facebook.callback")
  }

  object github {
    val clientId: String = config.getString("oauth2.github.clientId")
    val clientSecret: String = config.getString("oauth2.github.clientSecret")
    val state: String = config.getString("oauth2.github.state")
    val scope: String = config.getString("oauth2.github.scope")
    val callback: String = config.getString("oauth2.github.callback")
  }

  object linkedin {
    val clientId: String = config.getString("oauth2.linkedin.clientId")
    val clientSecret: String = config.getString("oauth2.linkedin.clientSecret")
    val state: String = config.getString("oauth2.linkedin.state")
    val scope: String = config.getString("oauth2.linkedin.scope")
    val callback: String = config.getString("oauth2.linkedin.callback")
  }
}
