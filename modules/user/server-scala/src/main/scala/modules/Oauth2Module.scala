package modules

import com.github.scribejava.apis.GoogleApi20
import com.github.scribejava.core.builder.ServiceBuilder
import com.github.scribejava.core.oauth.OAuth20Service
import com.google.inject.Provides
import config.AuthConfig
import javax.inject.Named
import net.codingwell.scalaguice.ScalaModule

class Oauth2Module extends ScalaModule {

  @Provides
  @Named("google")
  def oauth2Service(authConfig: AuthConfig): OAuth20Service =
    new ServiceBuilder(authConfig.google.clientId)
      .apiSecret(authConfig.google.clientSecret)
      .scope(authConfig.google.scope)
      .state(authConfig.google.state)
      .callback(authConfig.google.callback)
      .build(GoogleApi20.instance())
}