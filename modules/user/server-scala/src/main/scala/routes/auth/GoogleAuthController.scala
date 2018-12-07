package routes.auth

import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.StatusCodes.InternalServerError
import com.github.scribejava.core.oauth.OAuth20Service
import akka.http.scaladsl.model.headers.HttpCookie
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.ActorMaterializer
import com.google.inject.Inject
import com.google.inject.name.Named
import core.controllers.AkkaRoute
import model.{Tokens, User}
import model.oauth.{GoogleAuth, GoogleOauth2Response}
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import org.mindrot.jbcrypt.BCrypt
import repositories.UserRepository
import repositories.auth.GoogleAuthRepository
import services.UserOAuth2Service
import common.implicits.RichDBIO._

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

class GoogleAuthController @Inject()(@Named("google") oauth2Service: OAuth20Service,
                                     userOAuth2Service: UserOAuth2Service,
                                     userRepo: UserRepository,
                                     googleAuthRepository: GoogleAuthRepository,
                                     jwtAuthService: JwtAuthService[JwtContent])
                                    (implicit val executionContext: ExecutionContext,
                                     implicit val actorMaterializer: ActorMaterializer) extends AkkaRoute {

  override val routes: Route =
    (path("auth" / "google") & get) {
      redirect(oauth2Service.getAuthorizationUrl, StatusCodes.Found)
    } ~ (path("auth" / "google" / "callback") & get) {
      parameters('code) { code =>
        onComplete {
          for {
            googleUserInfo <- userOAuth2Service.getUserInfo[GoogleOauth2Response](code, "https://content.googleapis.com/oauth2/v2/userinfo", oauth2Service)
            user <- userRepo.save(User(
              username = googleUserInfo.name,
              email = googleUserInfo.email,
              role = "user",
              isActive = true,
              password = BCrypt.hashpw(googleUserInfo.id, BCrypt.gensalt)
            )).run
            googleUser <- googleAuthRepository.save(GoogleAuth(Some(googleUserInfo.id), googleUserInfo.name, user.id.get)).run
            accessToken = jwtAuthService.createAccessToken(JwtContent(googleUser.userId))
            refreshToken = jwtAuthService.createRefreshToken(JwtContent(googleUser.userId), user.password)
          } yield Tokens(accessToken, refreshToken)
        } {
          case Success(tokens) =>
            setCookie(HttpCookie("access-token", value = tokens.accessToken),
              HttpCookie("refresh-token", value = tokens.refreshToken)) {
              redirect("profile", StatusCodes.Found)
            }
          case Failure(exception) => complete(InternalServerError -> exception)
        }
      }
    }
}