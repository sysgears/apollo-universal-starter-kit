import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.model.StatusCodes.OK
import akka.util.ByteString
import common.routes.graphql.jsonProtocols.GraphQLMessage
import common.routes.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import spray.json._

class ChatSpec extends ChatHelper {

  def graphQLMessage(query: String) = ByteString(GraphQLMessage(query).toJson.compactPrint)

  "ChatSpec" must {

    "retrieve a messages by specified pagination params: limit, after" in {

      val queryMessages = s"query { " +
        s"messages(limit: 2, after:1) " +
        s"{ totalCount edges { node { id text userId username uuid quotedId quotedMessage { id text username } } cursor } pageInfo { endCursor hasNextPage } } }"

      val entity = HttpEntity(`application/json`, graphQLMessage(queryMessages))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"messages\":{\"totalCount\":4,\"edges\":[" +
          "{\"node\":{\"username\":\"\",\"quotedMessage\":null,\"quotedId\":null,\"uuid\":\"dfvlrkjgimneo12ldms345\",\"text\":\"Message text #[2]\",\"id\":2,\"userId\":null},\"cursor\":2}," +
          "{\"node\":{\"username\":\"\",\"quotedMessage\":null,\"quotedId\":null,\"uuid\":\"dfvlrkjgimneo12ldms345\",\"text\":\"Message text #[3]\",\"id\":3,\"userId\":null},\"cursor\":3}]," +
          "\"pageInfo\":{\"endCursor\":3,\"hasNextPage\":true}}}}"
      }
    }

    "retrieve a message by its id" in {

      val queryMessage = s"query { " +
        s"message(id:1) { id text userId username uuid quotedId quotedMessage { id text username } } }"

      val entity = HttpEntity(`application/json`, graphQLMessage(queryMessage))
      Post(endpoint, entity) ~> routes ~> check {
        println(responseAs[String])
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"message\":{\"username\":\"\",\"quotedMessage\":null,\"quotedId\":null,\"uuid\":\"dfvlrkjgimneo12ldms345\"," +
          "\"text\":\"Message text #[1]\",\"id\":1,\"userId\":null}}}"
      }
    }

    "save a new message" in {

      val mutationAddMessage =
        "mutation { addMessage ( input: { text:\" added any \", userId:1, uuid:\"dfsgadrfhafrhadshb\", quotedId:2}){ id text userId username quotedId quotedMessage{ id text } } }"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationAddMessage))
      Post(endpoint, entity) ~> routes ~> check {
        println(responseAs[String])
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"addMessage\":{" +
          "\"username\":\"\",\"quotedMessage\":{\"id\":2,\"text\":\"Message text #[2]\"},\"quotedId\":2,\"text\":\" added any \",\"id\":5,\"userId\":null}}}"
      }
    }
  }
}
