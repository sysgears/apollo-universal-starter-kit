import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.model.StatusCodes.OK
import akka.util.ByteString
import core.controllers.graphql.jsonProtocols.GraphQLMessage
import core.controllers.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import spray.json._

class UserSpec extends UserHelper {

  "UserSpec" must {

    val testEmail = "scala-test@gmail.com"
    val testPassword = "12345678q"
    val testUsername = "testName"

    val mutation =
      """
        |mutation RegisterUser($input: RegisterUserInput!){
        |	register(input: $input){
        |		user{
        |      id
        |      username
        |      email
        |    }
        |	}
        |}
      """.stripMargin

    val variables: JsObject =
      s"""
         |{
         |	"input": {
         |		"username": "$testUsername",
         |		"email": "$testEmail",
         |		"password": "$testPassword"
         |	}
         |}
      """.stripMargin.parseJson.asJsObject

    "register user" in {

      val graphQLMessage = ByteString(GraphQLMessage(mutation, None, Some(variables)).toJson.compactPrint)
      val entity = HttpEntity(`application/json`, graphQLMessage)

      Post(endpoint, entity) ~> routes ~> check {
        val response = responseAs[String]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        response should include("\"id\":1")
        response should include("\"username\":\"testName\"")
        response should include("\"email\":\"scala-test@gmail.com\"")
        response shouldNot include("password")
      }
    }
  }
}