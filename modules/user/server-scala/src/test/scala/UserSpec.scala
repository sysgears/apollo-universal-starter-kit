import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.model.StatusCodes.OK
import modules.jwt.model.JwtContent
import modules.jwt.service.JwtAuthService
import repositories.UserRepository
import akka.http.scaladsl.testkit.RouteTestTimeout
import akka.testkit.TestDuration
import akka.util.ByteString
import common.implicits.RichDBIO._
import common.routes.graphql.jsonProtocols.GraphQLMessage
import common.routes.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
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
}
