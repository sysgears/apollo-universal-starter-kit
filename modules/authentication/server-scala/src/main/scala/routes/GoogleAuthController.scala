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
import model.google.{GoogleAuth, GoogleOauth2Response}
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import org.mindrot.jbcrypt.BCrypt
import repositories.{GoogleAuthRepository, UserRepository}
import services.ExternalApiService
import spray.json._

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

class GoogleAuthController @Inject()(
    @Named("google") oauth2Service: OAuth20Service,
    externalApiService: ExternalApiService,
    userRepository: UserRepository,
    googleAuthRepository: GoogleAuthRepository,
    jwtAuthService: JwtAuthService[JwtContent]
)(implicit val executionContext: ExecutionContext) {

  val routes: Route =
    (path("auth" / "google") & get) {
      redirect(oauth2Service.getAuthorizationUrl, StatusCodes.Found)
    } ~ (path("auth" / "google" / "callback") & get) {
      parameters('state.?, 'code) {
        (state, code) =>
          onComplete {
            for {
              googleAuthInfo <- externalApiService.getUserInfo[GoogleOauth2Response](
                code,
                "https://content.googleapis.com/oauth2/v2/userinfo",
                oauth2Service
              )
              user <- googleAuthRepository.findOne(googleAuthInfo.id).run.flatMap {
                case Some(gUser) =>
                  userRepository.findOne(gUser.userId).run failOnNone AmbigousResult(
                    s"User with id: ${gUser.userId} stored in google auth table, but not in the user table"
                  )
                case None =>
                  for {
                    user <- userRepository
                      .save(
                        User(
                          username = googleAuthInfo.name,
                          email = googleAuthInfo.email,
                          password = BCrypt.hashpw(googleAuthInfo.id, BCrypt.gensalt),
                          role = "user",
                          isActive = true
                        )
                      )
                      .run
                    _ <- googleAuthRepository
                      .save(GoogleAuth(Some(googleAuthInfo.id), googleAuthInfo.name, user.id.get))
                      .run
                  } yield user
              }
            } yield jwtAuthService.createTokens(JwtContent(user.id.get), user.password)
          } {
            case Success(tokens) =>
              setCookie(
                HttpCookie("access-token", value = tokens.accessToken),
                HttpCookie("refresh-token", value = tokens.refreshToken)
              ) {
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
