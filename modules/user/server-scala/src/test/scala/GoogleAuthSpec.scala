import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.testkit.RouteTestTimeout
import akka.testkit.TestDuration
import com.github.scribejava.core.model.{OAuth2AccessToken, OAuthRequest, Response}
import com.github.scribejava.core.oauth.OAuth20Service
import repositories.auth.GoogleAuthRepository
import services.ExternalApiService
import routes.auth.GoogleAuthController
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import repositories.UserRepository

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

class GoogleAuthSpec extends TestHelper {
  implicit val timeout: RouteTestTimeout = RouteTestTimeout(10.seconds.dilated)
  val executionContext: ExecutionContext = inject[ExecutionContext]

  val userRepo: UserRepository = inject[UserRepository]
  val googleAuthRepository: GoogleAuthRepository = inject[GoogleAuthRepository]
  val externalApiService: ExternalApiService = inject[ExternalApiService]
  val jwtAuthService: JwtAuthService[JwtContent] = inject[JwtAuthService[JwtContent]]

  val oAuth2ServiceMock: OAuth20Service = stub[OAuth20Service]
  (() => oAuth2ServiceMock.getAuthorizationUrl).when().returns("localhostTest")
  ((code: String) => oAuth2ServiceMock.getAccessToken(code)).when(*).returns(new OAuth2AccessToken("testAccessToken"))

  val responseMock: Response = stub[Response]
  (() => responseMock.getBody).when().returns(
    """
      |{
      |   "id":"testId",
      |   "email":"test@test.com",
      |   "name":"testName"
      |}
    """.stripMargin)

  ((request: OAuthRequest) => oAuth2ServiceMock.execute(request)).when(*).returns(responseMock)

  val googleAuthController = new GoogleAuthController(oAuth2ServiceMock, externalApiService, userRepo, googleAuthRepository, jwtAuthService)(executionContext)
  val googleAuthRoutes: Route = googleAuthController.routes

  "GoogleAuthController" must {
    "redirect to google auth page" in {
      Get("/auth/google") ~> googleAuthRoutes ~> check {
        status shouldBe StatusCodes.Found
        status.isRedirection() shouldBe true
        responseAs[String] should include("localhostTest")
      }
    }
  }
}