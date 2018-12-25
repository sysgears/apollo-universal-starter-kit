package routes

import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.headers.HttpCookie
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import com.github.scribejava.core.oauth.OAuth20Service
import com.google.inject.Inject
import com.google.inject.name.Named
import common.errors.AmbigousResult
import common.implicits.RichDBIO._
import common.implicits.RichFuture._
import model.User
import model.linkedin.{LinkedinAuth, LinkedinOauth2Response}
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import org.mindrot.jbcrypt.BCrypt
import repositories.{LinkedinAuthRepository, UserRepository}
import services.ExternalApiService
import spray.json._

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

class LinkedinAuthController @Inject()(@Named("linkedin") oauth2Service: OAuth20Service,
                                       externalApiService: ExternalApiService,
                                       userRepository: UserRepository,
                                       linkedinAuthRepository: LinkedinAuthRepository,
                                       jwtAuthService: JwtAuthService[JwtContent])
                                      (implicit val executionContext: ExecutionContext) {

  val routes: Route =
    (path("auth" / "linkedin") & get) {
      redirect(oauth2Service.getAuthorizationUrl, StatusCodes.Found)
    } ~ (path("auth" / "linkedin" / "callback") & get) {
      parameters('state.?, 'code) { (state, code) =>
        onComplete {
          for {
            linkedinAuthInfo <- externalApiService.getUserInfo[LinkedinOauth2Response](code, "https://api.linkedin.com/v2/me", oauth2Service)
            user <- linkedinAuthRepository.findOne(linkedinAuthInfo.id).run.flatMap {
              case Some(lnUser) => userRepository.findOne(lnUser.userId).run failOnNone AmbigousResult(s"User with id: ${lnUser.userId} stored in linkedin auth table, but not in the user table")
              case None => for {
                user <- userRepository.save(
                  User(
                    username = linkedinAuthInfo.name,
                    email = linkedinAuthInfo.email,
                    password = BCrypt.hashpw(linkedinAuthInfo.id, BCrypt.gensalt),
                    role = "user",
                    isActive = true)
                ).run
                _ <- linkedinAuthRepository.save(LinkedinAuth(Some(linkedinAuthInfo.id), linkedinAuthInfo.name, user.id.get)).run
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