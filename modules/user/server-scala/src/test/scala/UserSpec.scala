import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.model.StatusCodes.{OK, Found}
import jwt.model.JwtContent
import jwt.service.JwtAuthService
import repositories.UserRepository
import akka.http.scaladsl.testkit.RouteTestTimeout
import akka.testkit.TestDuration
import akka.util.ByteString
import common.implicits.RichDBIO._
import common.routes.graphql.jsonProtocols.GraphQLMessage
import common.routes.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import routes.ConfirmRegistrationController
import spray.json.JsObject
import spray.json._

import scala.concurrent.duration._

class UserSpec extends UserTestHelper {
  implicit val timeout: RouteTestTimeout = RouteTestTimeout(10.seconds.dilated)

  val userRepo: UserRepository = inject[UserRepository]
  val authService: JwtAuthService[JwtContent] = inject[JwtAuthService[JwtContent]]

  val testEmail = "scala-test@gmail.com"
  val testPassword = "12345678q"
  val testUsername = "testName"

  val getUserQuery: String =
    """
      |query GetUser($input: Int!){
      |  user(id: $input) {
      |    user {
      |      id
      |      username
      |      email
      |    }
      |    errors {
      |      field
      |      message
      |    }
      |  }
      |}
    """.stripMargin

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

    Post(
      endpoint,
      HttpEntity(
        `application/json`,
        ByteString(GraphQLMessage(registerMutation, None, Some(registerVariables)).toJson.compactPrint)
      )
    ) ~> routes
  }

  "UserSpec" must {
    "get user by id [SUCCESS]" in {
      val getUserVariables: JsObject =
        """
          |{
          |	"input": 1
          |}
        """.stripMargin.parseJson.asJsObject

      val graphQLMessage = ByteString(GraphQLMessage(getUserQuery, None, Some(getUserVariables)).toJson.compactPrint)
      val entity = HttpEntity(`application/json`, graphQLMessage)

      Post(endpoint, entity) ~> routes ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"id\":1")
        response should include("\"username\":\"user\"")
        response should include("\"email\":\"user@example.com\"")
        response should include("\"errors\":null")
        response shouldNot include("password")
      }
    }

    "get user by id [FAILURE]" in {
      val getUserVariables: JsObject =
        """
          |{
          |	"input": 43
          |}
        """.stripMargin.parseJson.asJsObject

      val graphQLMessage = ByteString(GraphQLMessage(getUserQuery, None, Some(getUserVariables)).toJson.compactPrint)
      val entity = HttpEntity(`application/json`, graphQLMessage)

      Post(endpoint, entity) ~> routes ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"user\":null")
        response should include("\"errors\":null")
        response shouldNot include("password")
      }
    }

    "get all users with ordering and filtering" in {
      val getUsersQuery =
        """
          |query GetUsers($orderByInput: OrderByUserInput, $filterInput: FilterUserInput){
          |  users(orderBy: $orderByInput, filter: $filterInput) {
          |      id
          |      username
          |      email
          |  }
          |}
        """.stripMargin

      val getUsersVariables: JsObject =
        """
          |{
          |"orderByInput": {
          |      "column": "username",
          |      "order": "desc"
          |    },
          |"filterInput": {
          |      "searchText": "admin",
          |      "role": "admin",
          |      "isActive": true
          |    }
          |}
        """.stripMargin.parseJson.asJsObject

      val graphQLMessage = ByteString(GraphQLMessage(getUsersQuery, None, Some(getUsersVariables)).toJson.compactPrint)
      val entity = HttpEntity(`application/json`, graphQLMessage)

      Post(endpoint, entity) ~> routes ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"id\":2")
        response should include("\"username\":\"admin\"")
        response should include("\"email\":\"admin@example.com\"")
        response shouldNot include("password")
      }
    }

    "create new user" in {
      val createUserQuery =
        """
          |mutation CreateUser($input: AddUserInput!){
          |  addUser(input: $input) {
          |    user {
          |      id
          |      username
          |      email
          |    }
          |    errors {
          |      field
          |      message
          |    }
          |  }
          |}
        """.stripMargin

      val createUserVariables: JsObject =
        """
          |{
          |"input": {
          |   "username": "NewUser",
          |   "email": "newuser@example.com",
          |   "password": "testpass123456",
          |   "role": "user",
          |   "isActive": true
          |  }
          |}
        """.stripMargin.parseJson.asJsObject

      val graphQLMessage =
        ByteString(GraphQLMessage(createUserQuery, None, Some(createUserVariables)).toJson.compactPrint)
      val entity = HttpEntity(`application/json`, graphQLMessage)

      Post(endpoint, entity) ~> routes ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"id\":3")
        response should include("\"username\":\"NewUser\"")
        response should include("\"email\":\"newuser@example.com\"")
        response shouldNot include("password")
      }

      val createdUser = await(userRepo.findOne(3).run)

      createdUser should be(defined)
      createdUser.get.isActive shouldBe true
      createdUser.get.role shouldBe "user"
    }

    "edit existing user" in {
      val editUserQuery =
        """
          |mutation EditUser($input: EditUserInput!){
          |  editUser(input: $input) {
          |    user {
          |      id
          |      username
          |      email
          |    }
          |    errors {
          |      field
          |      message
          |    }
          |  }
          |}
        """.stripMargin

      val editUserVariables: JsObject =
        """
          |{
          |"input": {
          |   "id": 1,
          |   "username": "EditedUser",
          |   "email": "editeduser@example.com",
          |   "password": "testpass123456EDIT",
          |   "role": "admin",
          |   "isActive": true
          |  }
          |}
        """.stripMargin.parseJson.asJsObject

      val graphQLMessage = ByteString(GraphQLMessage(editUserQuery, None, Some(editUserVariables)).toJson.compactPrint)
      val entity = HttpEntity(`application/json`, graphQLMessage)

      Post(endpoint, entity) ~> routes ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"id\":1")
        response should include("\"username\":\"EditedUser\"")
        response should include("\"email\":\"editeduser@example.com\"")
        response shouldNot include("password")
      }

      val editedUser = await(userRepo.findOne(1).run)

      editedUser should be(defined)
      editedUser.get.isActive shouldBe true
      editedUser.get.role shouldBe "admin"
    }

    "delete existing user" in {
      val deleteUserQuery =
        """
          |mutation DeleteUser($input: Int!){
          |  deleteUser(id: $input) {
          |    user {
          |      id
          |      username
          |      email
          |    }
          |    errors {
          |      field
          |      message
          |    }
          |  }
          |}
        """.stripMargin

      val deleteUserVariables: JsObject =
        """
          |{
          |	"input": 1
          |}
        """.stripMargin.parseJson.asJsObject

      val graphQLMessage =
        ByteString(GraphQLMessage(deleteUserQuery, None, Some(deleteUserVariables)).toJson.compactPrint)
      val entity = HttpEntity(`application/json`, graphQLMessage)

      Post(endpoint, entity) ~> routes ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"id\":1")
        response should include("\"username\":\"user\"")
        response should include("\"email\":\"user@example.com\"")
        response should include("\"errors\":null")
        response shouldNot include("password")
      }

      val deletedUser = await(userRepo.findOne(1).run)

      deletedUser should not be defined
    }

    "register user" in {
      registrationStep ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"id\":3")
        response should include("\"username\":\"testName\"")
        response should include("\"email\":\"scala-test@gmail.com\"")
        response should include("\"role\":\"user\"")
        response should include("\"isActive\":false")
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
        response should include("\"id\":3")
        response should include("\"username\":\"testName\"")
        response should include("\"email\":\"scala-test@gmail.com\"")
        response should include("\"accessToken\"")
        response should include("\"refreshToken\"")
        response shouldNot include("password")
      }
    }

    "confirm registration" in {
      registrationStep ~> check()

      val user = await(userRepo.findByUsernameOrEmail(testEmail).run)
      await(userRepo.update(user.get.copy(isActive = false)).run)
      val token = authService.createAccessToken(JwtContent(3))

      val confirmRegistrationRoutes = inject[ConfirmRegistrationController].routes

      Get(s"/confirmation?token=$token") ~> confirmRegistrationRoutes ~> check {
        val response = responseAs[String]

        status shouldBe Found
        response should include("/login")
      }
    }

    "resend confirmation message" in {
      registrationStep ~> check()

      val user = await(userRepo.findByUsernameOrEmail(testEmail).run)
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

      val graphQLMessage = ByteString(
        GraphQLMessage(resendConfirmationMessageMutation, None, Some(resendConfirmationMessageVariables)).toJson.compactPrint
      )
      val entity = HttpEntity(`application/json`, graphQLMessage)

      Post(endpoint, entity) ~> routes ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"id\":3")
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
           |{"input":{"email":"$testEmail"}}
      """.stripMargin.parseJson.asJsObject

      val graphQLMessage =
        ByteString(GraphQLMessage(forgotPasswordMutation, None, Some(forgotPasswordVariables)).toJson.compactPrint)
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
           |{"input":{"token":"$token", "password": "$testPassword", "passwordConfirmation": "$testPassword"}}
      """.stripMargin.parseJson.asJsObject

      val graphQLMessage =
        ByteString(GraphQLMessage(forgotPasswordMutation, None, Some(forgotPasswordVariables)).toJson.compactPrint)
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
