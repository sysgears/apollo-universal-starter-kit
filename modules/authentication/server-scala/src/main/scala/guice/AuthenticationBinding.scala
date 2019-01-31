package guice

import com.github.scribejava.apis.{FacebookApi, GitHubApi, GoogleApi20, LinkedInApi20}
import com.github.scribejava.core.builder.ServiceBuilder
import com.github.scribejava.core.oauth.OAuth20Service
import com.google.inject.Provides
import config.AuthConfig
import core.guice.injection.GuiceActorRefProvider
import javax.inject.Named
import jwt.guice.modules.JwtBinding
import net.codingwell.scalaguice.ScalaModule
import services.{ExternalApiService, ExternalApiServiceImpl}

class AuthenticationBinding extends ScalaModule with GuiceActorRefProvider {

  override def configure() = {
    install(new JwtBinding)
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

  @Provides
  @Named("github")
  def githubOAuth2Service(authConfig: AuthConfig): OAuth20Service =
    new ServiceBuilder(authConfig.github.clientId)
      .apiSecret(authConfig.github.clientSecret)
      .scope(authConfig.github.scope)
      .state(authConfig.github.state)
      .callback(authConfig.github.callback)
      .build(GitHubApi.instance())

  @Provides
  @Named("linkedin")
  def linkedinOAuth2Service(authConfig: AuthConfig): OAuth20Service =
    new ServiceBuilder(authConfig.linkedin.clientId)
      .apiSecret(authConfig.linkedin.clientSecret)
      .scope(authConfig.linkedin.scope)
      .state(authConfig.linkedin.state)
      .callback(authConfig.linkedin.callback)
      .build(LinkedInApi20.instance())
}
