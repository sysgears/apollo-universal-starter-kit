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
import modules.jwt.model.JwtContent
import modules.jwt.model.Tokens._
import modules.jwt.service.JwtAuthService
import org.mindrot.jbcrypt.BCrypt
import repositories.UserRepository
import repositories.auth.FacebookAuthRepository
import services.ExternalApiService
import common.implicits.RichDBIO._
import common.implicits.RichFuture._
import core.loaders.IgnoreModule
import model.oauth.facebook.{FacebookAuth, FacebookOauth2Response}
import spray.json._

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

@IgnoreModule
class FacebookAuthController @Inject()(@Named("facebook") oauth2Service: OAuth20Service,
                                       externalApiService: ExternalApiService,
                                       userRepository: UserRepository,
                                       facebookAuthRepository: FacebookAuthRepository,
                                       jwtAuthService: JwtAuthService[JwtContent])
                                      (implicit val executionContext: ExecutionContext) extends AkkaRoute {

  override val routes: Route =
    (path("auth" / "facebook") & get) {
      redirect(oauth2Service.getAuthorizationUrl, StatusCodes.Found)
    } ~ (path("auth" / "facebook" / "callback") & get) {
      parameters('state.?, 'code) { (state, code) =>
        onComplete {
          for {
            facebookAuthInfo <- externalApiService.getUserInfo[FacebookOauth2Response](code, "https://graph.facebook.com/me?fields=id,name,email", oauth2Service)
            user <- facebookAuthRepository.findOne(facebookAuthInfo.id).run.flatMap {
              case Some(fUser) => userRepository.findOne(fUser.userId).run failOnNone AmbigousResult(s"User with id: ${fUser.userId} stored in facebook auth table, but not in the user table")
              case None => for {
                user <- userRepository.save(
                  User(
                    username = facebookAuthInfo.name,
                    email = facebookAuthInfo.email,
                    password = BCrypt.hashpw(facebookAuthInfo.id, BCrypt.gensalt),
                    role = "user",
                    isActive = true)
                ).run
                _ <- facebookAuthRepository.save(FacebookAuth(Some(facebookAuthInfo.id), facebookAuthInfo.name, user.id.get)).run
              } yield user
            }
          } yield jwtAuthService.createTokens(JwtContent(user.id.get), user.password)
        } {
          case Success(tokens) =>
            setCookie(HttpCookie("access-token", value = tokens.accessToken), HttpCookie("refresh-token", value = tokens.refreshToken)) {
              state match {
                case Some(redirectUrl) => redirect(s"$redirectUrl?data=${tokens.toJson.toString}", StatusCodes.Found)
                case None => redirect("/profile", StatusCodes.Found)
              }
            }
          case Failure(_) => redirect("/login", StatusCodes.Found)
        }
      }
    }
}