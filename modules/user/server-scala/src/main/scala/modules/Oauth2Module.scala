package modules

import com.github.scribejava.apis.{FacebookApi, GoogleApi20}
import com.github.scribejava.core.builder.ServiceBuilder
import com.github.scribejava.core.oauth.OAuth20Service
import com.google.inject.Provides
import config.AuthConfig
import javax.inject.Named
import net.codingwell.scalaguice.ScalaModule
import services.{ExternalApiService, ExternalApiServiceImpl}

class Oauth2Module extends ScalaModule {

  override def configure() = {
    bind[ExternalApiService].to[ExternalApiServiceImpl]
  }

  @Provides
  @Named("google")
  def googleOAuth2Service(authConfig: AuthConfig): OAuth20Service =
    new ServiceBuilder(authConfig.google.clientId)
      .apiSecret(authConfig.google.clientSecret)
      .scope(authConfig.google.scope)
      .state(authConfig.google.state)
      .callback(authConfig.google.callback)
      .build(GoogleApi20.instance())

  @Provides
  @Named("facebook")
  def facebookOAuth2Service(authConfig: AuthConfig): OAuth20Service =
    new ServiceBuilder(authConfig.facebook.clientId)
      .apiSecret(authConfig.facebook.clientSecret)
      .scope(authConfig.facebook.scope)
      .state(authConfig.facebook.state)
      .callback(authConfig.facebook.callback)
      .build(FacebookApi.instance())
}