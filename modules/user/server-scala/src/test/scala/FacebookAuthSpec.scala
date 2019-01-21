import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.RouteTestTimeout
import akka.testkit.TestDuration
import com.github.scribejava.core.model.{OAuth2AccessToken, OAuthRequest, Response}
import com.github.scribejava.core.oauth.OAuth20Service
import jwt.model.JwtContent
import jwt.service.JwtAuthService
import repositories.UserRepository
import repositories.auth.FacebookAuthRepository
import routes.FacebookAuthController
import services.ExternalApiService

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

class FacebookAuthSpec extends UserTestHelper {
  implicit val timeout: RouteTestTimeout = RouteTestTimeout(10.seconds.dilated)
  val executionContext: ExecutionContext = inject[ExecutionContext]

  val userRepository: UserRepository = inject[UserRepository]
  val authRepository: FacebookAuthRepository = inject[FacebookAuthRepository]
  val externalApiService: ExternalApiService = inject[ExternalApiService]
  val jwtAuthService: JwtAuthService[JwtContent] = inject[JwtAuthService[JwtContent]]

  val oAuth2ServiceMock: OAuth20Service = stub[OAuth20Service]
  val responseMock: Response = stub[Response]

  val authController =
    new FacebookAuthController(oAuth2ServiceMock, externalApiService, userRepository, authRepository, jwtAuthService)(
      executionContext
    )
  val authRoutes: Route = authController.routes

  "FacebookAuthController" must {
    "redirect to facebook auth page" in {
      (() => oAuth2ServiceMock.getAuthorizationUrl).when.returns("localhostTest")

      Get("/auth/facebook") ~> authRoutes ~> check {
        status shouldBe StatusCodes.Found
        status.isRedirection() shouldBe true
        responseAs[String] should include("localhostTest")
      }
    }

    "redirect to profile page with tokens" in {
      ((code: String) => oAuth2ServiceMock.getAccessToken(code))
        .when(*)
        .returns(new OAuth2AccessToken("testAccessToken"))
      ((token: OAuth2AccessToken, request: OAuthRequest) => oAuth2ServiceMock.signRequest(token, request))
        .when(*, *)
        .returns()
      (() => responseMock.getBody).when.returns("""
          |{
          |   "id":"testId",
          |   "email":"test@test.com",
          |   "name":"testName"
          |}
        """.stripMargin)
      ((request: OAuthRequest) => oAuth2ServiceMock.execute(request)).when(*).returns(responseMock)

      Get("/auth/facebook/callback?code=test") ~> authRoutes ~> check {
        status shouldBe StatusCodes.Found
        status.isRedirection() shouldBe true
        responseAs[String] should include("/profile")
        val cookies = response.headers.filter(_.is("set-cookie"))
        cookies should not be empty
        cookies.head.value should include("access-token")
        cookies.last.value should include("refresh-token")
      }
    }

    "redirect to profile page with tokens ih headers and in parameters" in {
      ((code: String) => oAuth2ServiceMock.getAccessToken(code))
        .when(*)
        .returns(new OAuth2AccessToken("testAccessToken"))
      ((token: OAuth2AccessToken, request: OAuthRequest) => oAuth2ServiceMock.signRequest(token, request))
        .when(*, *)
        .returns()
      (() => responseMock.getBody).when.returns("""
          |{
          |   "id":"testId",
          |   "email":"test@test.com",
          |   "name":"testName"
          |}
        """.stripMargin)
      ((request: OAuthRequest) => oAuth2ServiceMock.execute(request)).when(*).returns(responseMock)

      Get("/auth/facebook/callback?state=test&code=test") ~> authRoutes ~> check {
        status shouldBe StatusCodes.Found
        status.isRedirection() shouldBe true
        responseAs[String] should include("test?data=")
        responseAs[String] should include("accessToken")
        responseAs[String] should include("refreshToken")
        val cookies = response.headers.filter(_.is("set-cookie"))
        cookies should not be empty
        cookies.head.value should include("access-token")
        cookies.last.value should include("refresh-token")
      }
    }

    "redirect to login page if an error was capture" in {
      Get("/auth/facebook/callback?code=test") ~> authRoutes ~> check {
        status shouldBe StatusCodes.Found
        status.isRedirection() shouldBe true
        responseAs[String] should include("/login")
      }
    }
  }
}
