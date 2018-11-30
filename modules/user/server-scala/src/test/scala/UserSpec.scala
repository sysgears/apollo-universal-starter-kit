import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.model.StatusCodes.OK
import akka.http.scaladsl.testkit.RouteTestTimeout
import akka.util.ByteString
import akka.testkit.TestDuration
import core.controllers.graphql.jsonProtocols.GraphQLMessage
import core.controllers.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import repositories.UserRepository
import common.implicits.RichDBIO._
import spray.json._

import scala.concurrent.duration._

class UserSpec extends TestHelper {

  implicit val timeout: RouteTestTimeout = RouteTestTimeout(10.seconds.dilated)

  val userRepo: UserRepository = inject[UserRepository]
  val authService: JwtAuthService[JwtContent] = inject[JwtAuthService[JwtContent]]

  val testEmail = "scala-test@gmail.com"
  val testPassword = "12345678q"
  val testUsername = "testName"

  "UserSpec" must {
    def registrationStep: RouteTestResult = {
      val registerMutation =
        """
          |mutation RegisterUser($input: RegisterUserInput!){
          |	register(input: $input){
          |		user {
          |      id
          |      username
          |      email
          |      role
          |      isActive
          |    }
          |	}
          |}
        """.stripMargin

      val registerVariables: JsObject =
        s"""
           |{
           |	"input": {
           |		"username": "$testUsername",
           |		"email": "$testEmail",
           |		"password": "$testPassword"
           |	}
           |}
      """.stripMargin.parseJson.asJsObject

      Post(endpoint,
        HttpEntity(`application/json`,
          ByteString(GraphQLMessage(registerMutation, None, Some(registerVariables)).toJson.compactPrint)
        )) ~> routes
    }

    "register user" in {
      registrationStep ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"id\":1")
        response should include("\"username\":\"testName\"")
        response should include("\"email\":\"scala-test@gmail.com\"")
        response should include("\"role\":\"user\"")
        response should include("\"isActive\":true")
        response shouldNot include("password")
      }
    }

    "login user" in {
      registrationStep ~> check()

      val loginMutation =
        """
          |mutation LoginUser($input: LoginUserInput!){
          |	login(input: $input){
          |		user {
          |      id
          |      username
          |      email
          |    }
          |    tokens {
          |      accessToken
          |      refreshToken
          |    }
          |    errors {
          |      field
          |      message
          |    }
          |	}
          |}
        """.stripMargin

      val loginVariables: JsObject =
        s"""
           |{
           |	"input": {
           |		"usernameOrEmail": "$testEmail",
           |		"password": "$testPassword"
           |	}
           |}
      """.stripMargin.parseJson.asJsObject

      val graphQLMessage = ByteString(GraphQLMessage(loginMutation, None, Some(loginVariables)).toJson.compactPrint)
      val entity = HttpEntity(`application/json`, graphQLMessage)

      Post(endpoint, entity) ~> routes ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"id\":1")
        response should include("\"username\":\"testName\"")
        response should include("\"email\":\"scala-test@gmail.com\"")
        response should include("\"accessToken\"")
        response should include("\"refreshToken\"")
        response shouldNot include("password")
      }
    }

    "confirm registration" in {
      registrationStep ~> check()

      val user = await(userRepo.findOne(testEmail).run)
      await(userRepo.update(user.get.copy(isActive = false)).run)
      val token = authService.createAccessToken(JwtContent(1))

      val confirmRegistrationMutation =
        """
          |mutation ConfirmRegistration($input: ConfirmRegistrationInput!){
          |	confirmRegistration(input: $input){
          |		user {
          |      id
          |      username
          |      email
          |      role
          |      isActive
          |    }
          |    tokens {
          |      accessToken
          |      refreshToken
          |    }
          |    errors {
          |      field
          |      message
          |    }
          |	}
          |}
        """.stripMargin

      val confirmRegistrationVariables: JsObject =
        s"""
           |{"input":{"token": "$token"}}
      """.stripMargin.parseJson.asJsObject

      val graphQLMessage = ByteString(GraphQLMessage(confirmRegistrationMutation, None, Some(confirmRegistrationVariables)).toJson.compactPrint)
      val entity = HttpEntity(`application/json`, graphQLMessage)

      Post(endpoint, entity) ~> routes ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"id\":1")
        response should include("\"username\":\"testName\"")
        response should include("\"email\":\"scala-test@gmail.com\"")
        response should include("\"role\":\"user\"")
        response should include("\"isActive\":true")
        response should include("\"accessToken\"")
        response should include("\"refreshToken\"")
        response shouldNot include("password")
      }
    }

    "resend confirmation message" in {
      registrationStep ~> check()

      val user = await(userRepo.findOne(testEmail).run)
      await(userRepo.update(user.get.copy(isActive = false)).run)

      val resendConfirmationMessageMutation =
        """
          |mutation ResendConfirmationMessage($input: ResendConfirmationMessageInput!){
          |	resendConfirmationMessage(input: $input){
          |    user {
          |      id
          |      username
          |      email
          |      role
          |      isActive
          |    }
          |    errors {
          |      field
          |      message
          |    }
          |	}
          |}
        """.stripMargin

      val resendConfirmationMessageVariables: JsObject =
        s"""
           |{"input":{"usernameOrEmail":"$testEmail","password":"$testPassword"}}
      """.stripMargin.parseJson.asJsObject

      val graphQLMessage = ByteString(GraphQLMessage(resendConfirmationMessageMutation, None, Some(resendConfirmationMessageVariables)).toJson.compactPrint)
      val entity = HttpEntity(`application/json`, graphQLMessage)

      Post(endpoint, entity) ~> routes ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"id\":1")
        response should include("\"username\":\"testName\"")
        response should include("\"email\":\"scala-test@gmail.com\"")
        response should include("\"role\":\"user\"")
        response should include("\"isActive\":false")
        response shouldNot include("password")
      }
    }

    "forgot password" in {
      registrationStep ~> check()

      val forgotPasswordMutation =
        """
          |mutation ForgotPassword($input: ForgotPasswordInput!){
          |	forgotPassword(input: $input)
          |}
        """.stripMargin

      val forgotPasswordVariables: JsObject =
        s"""
           |{"input":{"usernameOrEmail":"$testEmail"}}
      """.stripMargin.parseJson.asJsObject

      val graphQLMessage = ByteString(GraphQLMessage(forgotPasswordMutation, None, Some(forgotPasswordVariables)).toJson.compactPrint)
      val entity = HttpEntity(`application/json`, graphQLMessage)

      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
      }
    }


    "reset password" in {
      registrationStep ~> check()

      val token = authService.createAccessToken(JwtContent(1))

      val forgotPasswordMutation =
        """
          |mutation ResetPassword($input: ResetPasswordInput!){
          |	resetPassword(input: $input){
          |    errors{
          |      field
          |      message
          |    }
          |  }
          |}
        """.stripMargin

      val forgotPasswordVariables: JsObject =
        s"""
           |{"input":{"token":"$token", "password": "$testPassword"}}
      """.stripMargin.parseJson.asJsObject

      val graphQLMessage = ByteString(GraphQLMessage(forgotPasswordMutation, None, Some(forgotPasswordVariables)).toJson.compactPrint)
      val entity = HttpEntity(`application/json`, graphQLMessage)

      Post(endpoint, entity) ~> routes ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"errors\":null")
      }
    }
  }
}