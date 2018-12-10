package routes.auth

import akka.http.scaladsl.model.StatusCodes
import com.github.scribejava.core.oauth.OAuth20Service
import akka.http.scaladsl.model.headers.HttpCookie
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import com.google.inject.Inject
import com.google.inject.name.Named
import common.errors.AmbigousResult
import core.controllers.AkkaRoute
import model.User
import model.oauth.{GoogleAuth, GoogleOauth2Response}
import modules.jwt.model.JwtContent
import modules.jwt.model.Tokens._
import modules.jwt.service.JwtAuthService
import org.mindrot.jbcrypt.BCrypt
import repositories.UserRepository
import repositories.auth.GoogleAuthRepository
import services.UserOAuth2Service
import common.implicits.RichDBIO._
import common.implicits.RichFuture._
import spray.json._

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

class GoogleAuthController @Inject()(@Named("google") oauth2Service: OAuth20Service,
                                     userOAuth2Service: UserOAuth2Service,
                                     userRepository: UserRepository,
                                     googleAuthRepository: GoogleAuthRepository,
                                     jwtAuthService: JwtAuthService[JwtContent])
                                    (implicit val executionContext: ExecutionContext) extends AkkaRoute {

  override val routes: Route =
    (path("auth" / "google") & get) {
      redirect(oauth2Service.getAuthorizationUrl, StatusCodes.Found)
    } ~ (path("auth" / "google" / "callback") & get) {
      parameters('state.?, 'code) { (state, code) =>
        onComplete {
          for {
            googleAuthInfo <- userOAuth2Service.getUserInfo[GoogleOauth2Response](code, "https://content.googleapis.com/oauth2/v2/userinfo", oauth2Service)
            user <- googleAuthRepository.findOne(googleAuthInfo.id).run.flatMap {
              case Some(gUser) => userRepository.findOne(gUser.userId).run failOnNone AmbigousResult(s"User with id: ${gUser.userId} stored in google auth table, but not in the user table")
              case None => for {
               user <- userRepository.save(User(None, googleAuthInfo.name, googleAuthInfo.email, BCrypt.hashpw(googleAuthInfo.id, BCrypt.gensalt), "user", true)).run
                 _ <- googleAuthRepository.save(GoogleAuth(Some(googleAuthInfo.id), googleAuthInfo.name, user.id.get)).run
              } yield user
            }
          } yield jwtAuthService.createTokens(JwtContent(user.id.get), user.password)
        } {
          case Success(tokens) =>
            setCookie(HttpCookie("access-token", value = tokens.accessToken), HttpCookie("refresh-token", value = tokens.refreshToken)) {
              state match {
                case Some(redirectUrl) => redirect(s"$redirectUrl?data=${tokens.toJson.toString}", StatusCodes.Found)
                case None => redirect("profile", StatusCodes.Found)
              }
            }
          case Failure(_) => redirect("profile", StatusCodes.Found)
        }
      }
    }
}