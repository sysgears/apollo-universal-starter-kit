package routes.auth

import akka.actor.ActorRef
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.StatusCodes.InternalServerError
import com.github.scribejava.core.model.{OAuthRequest, Verb}
import com.github.scribejava.core.oauth.OAuth20Service
import akka.http.scaladsl.model.headers.HttpCookie
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.ActorMaterializer
import com.google.inject.Inject
import com.google.inject.name.Named
import common.ActorMessageDelivering
import common.errors.NotFound
import core.controllers.AkkaRoute
import graphql.resolvers.UserResolver
import model.{RegisterUserInput, UserPayload}
import model.oauth.GoogleOauthResponse
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import org.mindrot.jbcrypt.BCrypt
import common.implicits.RichFuture._
import spray.json._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

class GoogleAuthController @Inject()(@Named("google") oauthService: OAuth20Service,
                                     @Named(UserResolver.name) userResolverRef: ActorRef,
                                     jwtAuthService: JwtAuthService[JwtContent])
                                    (implicit val executionContext: ExecutionContext,
                                     implicit val actorMaterializer: ActorMaterializer) extends AkkaRoute
  with ActorMessageDelivering {

  override val routes: Route =
    (path("auth" / "google") & get) {
      redirect(oauthService.getAuthorizationUrl, StatusCodes.Found)
    } ~ (path("auth" / "google" / "callback") & get) {
      parameters('code) { code =>
        onComplete {
          for {
            oauthAccessToken <- Future(oauthService.getAccessTokenAsync(code).get)
            request = new OAuthRequest(Verb.GET, "https://content.googleapis.com/oauth2/v2/userinfo")
            _ = oauthService.signRequest(oauthAccessToken, request)
            response <- Future(oauthService.executeAsync(request).get)
            googleResponse = response.getBody.parseJson.convertTo[GoogleOauthResponse]
            password = BCrypt.hashpw(googleResponse.id, BCrypt.gensalt)
            user <- sendMessageToActor[UserPayload](userResolverRef,
              (RegisterUserInput(
                googleResponse.name,
                googleResponse.email,
                password
              ), true)
            ).map(_.user) failOnNone NotFound(s"User with username: [${googleResponse.name}] not found.")
            userId <- Future.successful(user.id) failOnNone NotFound(s"Id for user: [${user.username}] is none.")
            accessToken = jwtAuthService.createAccessToken(JwtContent(userId))
            refreshToken = jwtAuthService.createRefreshToken(JwtContent(userId), password)
          } yield (accessToken, refreshToken)
        } {
          case Success((accessToken, refreshToken)) =>
            setCookie(HttpCookie("access-token", value = accessToken),
              HttpCookie("refresh-token", value = refreshToken)) {
              redirect("profile", StatusCodes.Found)
            }
          case Failure(exception) => complete(InternalServerError -> exception)
        }
      }
    }
}