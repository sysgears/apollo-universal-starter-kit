import java.nio.file.{Path, Paths}

import akka.http.scaladsl.model.MediaTypes._
import akka.http.scaladsl.model.StatusCodes.OK
import akka.http.scaladsl.model.{ContentTypes, HttpEntity, Multipart}
import akka.http.scaladsl.testkit.RouteTestTimeout
import akka.testkit.TestDuration
import akka.util.ByteString
import common.routes.graphql.jsonProtocols.GraphQLMessage
import common.routes.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import models.Message
import org.apache.commons.io.FileUtils
import spray.json._

import scala.concurrent.duration._

class ChatSpec extends ChatHelper {

  def graphQLMessage(query: String) = ByteString(GraphQLMessage(query).toJson.compactPrint)

  import models.MessageJsonProtocol.MessageJsonProtocolFormat
  implicit val timeout: RouteTestTimeout = RouteTestTimeout(10.seconds.dilated)

  "ChatSpec" must {

    "retrieve a messages by specified pagination params: limit, after" in {

      val queryMessages = "query { " +
        "messages(limit: 2, after:1) " +
        "{ totalCount edges { node { id text userId username uuid quotedId quotedMessage { id text username } } cursor } pageInfo { endCursor hasNextPage } } }"

      val entity = HttpEntity(`application/json`, graphQLMessage(queryMessages))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"messages\":{\"totalCount\":4,\"edges\":[" +
          "{\"node\":{\"username\":\"testUser\",\"quotedMessage\":null,\"quotedId\":null,\"uuid\":\"dfvlrkjgimneo12ldms345\",\"text\":\"Message text #[2]\",\"id\":2,\"userId\":1},\"cursor\":2}," +
          "{\"node\":{\"username\":\"testUser\",\"quotedMessage\":null,\"quotedId\":null,\"uuid\":\"dfvlrkjgimneo12ldms345\",\"text\":\"Message text #[3]\",\"id\":3,\"userId\":1},\"cursor\":3}]," +
          "\"pageInfo\":{\"endCursor\":3,\"hasNextPage\":true}}}}"
      }
    }

    "retrieve a message by its id" in {

      val queryMessage = "query { " +
        "message(id:1) { id text userId username uuid quotedId quotedMessage { id text username } } }"

      val entity = HttpEntity(`application/json`, graphQLMessage(queryMessage))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String].parseJson.asJsObject
          .fields("data")
          .asJsObject()
          .fields("message")
          .asJsObject
          .convertTo[Message]

        result.id shouldEqual 1
        result.text shouldEqual "Message text #[1]"
        result.username shouldEqual Some("testUser")
        result.userId shouldEqual Some(1)
      }
    }

    "save a new message" in {

      val mutationAddMessage =
        "mutation { addMessage ( input: { text:\" added any \", userId:1, uuid:\"dfsgadrfhafrhadshb\", quotedId:2}){ id text userId username quotedId quotedMessage{ id text } } }"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationAddMessage))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"addMessage\":{" +
          "\"username\":\"testUser\",\"quotedMessage\":{\"id\":2,\"text\":\"Message text #[2]\"},\"quotedId\":2,\"text\":\" added any \",\"id\":5,\"userId\":1}}}"
      }
    }

    "edit an existed message" in {

      val mutationEditMessage =
        "mutation { editMessage ( input: { id:1 text: \"UPDATED TEXT\" userId:1 }){ id text userId username quotedId quotedMessage{ id text } } }"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationEditMessage))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String].parseJson.asJsObject
          .fields("data")
          .asJsObject()
          .fields("editMessage")
          .asJsObject
          .convertTo[Message]

        result.id shouldEqual 1
        result.text shouldEqual "UPDATED TEXT"
        result.username shouldEqual Some("testUser")
        result.userId shouldEqual Some(1)
      }
    }

    "not edit not existed message" in {

      val mutationEditMessage =
        "mutation { editMessage ( input: { id:10 text: \"UPDATED TEXT\" userId:1 }){ id text userId username quotedId quotedMessage{ id text } } }"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationEditMessage))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":null," +
          "\"errors\":[{\"message\":\"Not found message with [id=10], [userId=Some(1)]\",\"path\":[\"editMessage\"],\"locations\":[{\"line\":1,\"column\":12}]}]}"
      }
    }

    "delete an existed message" in {

      val mutationDeleteMessage =
        "mutation { deleteMessage (id: 1) { id text uuid userId username quotedId quotedMessage { id text } } }"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationDeleteMessage))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String].parseJson.asJsObject
          .fields("data")
          .asJsObject()
          .fields("deleteMessage")
          .asJsObject
          .convertTo[Message]

        result.id shouldEqual 1
        result.text shouldEqual "Message text #[1]"
        result.username shouldEqual Some("testUser")
      }
    }

    "not delete not existed message" in {

      val mutationDeleteMessage =
        "mutation { deleteMessage (id: 10) { id text uuid userId username quotedId quotedMessage { id text } } }"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationDeleteMessage))
      Post(endpoint, entity) ~> routes ~> check {
        status shouldBe OK
        val result = responseAs[String]
        result shouldEqual "{\"data\":{\"deleteMessage\":null}," +
          "\"errors\":[{\"message\":\"Not found message with = 10\",\"path\":[\"deleteMessage\"],\"locations\":[{\"line\":1,\"column\":12}]}]}"
      }
    }

    "save a new message with attachment" in {

      val mutationAddMessage =
        "mutation { addMessage ( input: { text:\"message with attachment\", userId:1, uuid:\"dfsgadrfhafrhadshb\", quotedId:2}){ id text userId username quotedId filename path } }"

      val addAttachmentEntity = Multipart.FormData(
        Multipart.FormData.BodyPart.Strict(
          "operations",
          HttpEntity(`application/json`, graphQLMessage(mutationAddMessage))
        ),
        Multipart.FormData.BodyPart.Strict(
          "map",
          HttpEntity(`application/json`, "{\"0\":[\"variables.files.0\"]}")
        ),
        Multipart.FormData.BodyPart.Strict(
          "0",
          HttpEntity(ContentTypes.`text/plain(UTF-8)`, "2,3,5\n7,11,13,17,23\n29,31,37\n"),
          Map("filename" -> "attachment.txt")
        )
      )

      Post(endpoint, addAttachmentEntity) ~> routes ~> check {

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        val result = responseAs[String].parseJson.asJsObject
          .fields("data")
          .asJsObject()
          .fields("addMessage")
          .asJsObject
          .convertTo[Message]

        result.id shouldEqual 5
        result.text shouldEqual "message with attachment"
        result.path.isDefined shouldEqual true
        result.filename shouldEqual Some("attachment.txt")
      }
    }

    "delete an existed message and attachment" in {
      val mutationAddMessage =
        "mutation { addMessage ( input: { text:\"message with attachment\", userId:1, uuid:\"dfsgadrfhafrhadshb\", quotedId:2}){ id text userId username quotedId filename path } }"

      val addAttachmentEntity = Multipart.FormData(
        Multipart.FormData.BodyPart.Strict(
          "operations",
          HttpEntity(`application/json`, graphQLMessage(mutationAddMessage))
        ),
        Multipart.FormData.BodyPart.Strict(
          "map",
          HttpEntity(`application/json`, "{\"0\":[\"variables.files.0\"]}")
        ),
        Multipart.FormData.BodyPart.Strict(
          "0",
          HttpEntity(ContentTypes.`text/plain(UTF-8)`, "2,3,5\n7,11,13,17,23\n29,31,37\n"),
          Map("filename" -> "attachment.txt")
        )
      )

      Post(endpoint, addAttachmentEntity) ~> routes ~> check {

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        val result = responseAs[String].parseJson.asJsObject
          .fields("data")
          .asJsObject()
          .fields("addMessage")
          .asJsObject
          .convertTo[Message]

        result.id shouldEqual 5
        result.text shouldEqual "message with attachment"
        result.path.isDefined shouldEqual true
        result.filename shouldEqual Some("attachment.txt")
      }

      val mutationDeleteMessage =
        "mutation { deleteMessage (id: 5) { id text uuid userId username filename path } }"

      val entity = HttpEntity(`application/json`, graphQLMessage(mutationDeleteMessage))
      Post(endpoint, entity) ~> routes ~> check {

        contentType.mediaType shouldBe `application/json`
        status shouldBe OK
        val result = responseAs[String].parseJson.asJsObject
          .fields("data")
          .asJsObject()
          .fields("deleteMessage")
          .asJsObject
          .convertTo[Message]

        result.id shouldEqual 5
        result.text shouldEqual "message with attachment"
        result.path.isDefined shouldEqual true
        result.filename shouldEqual Some("attachment.txt")

        Paths.get(getClass.getResource("/").getPath, result.path.get).toFile.exists shouldBe false
      }
    }
  }

  override def clean(): Unit = {
    deleteDirIfExists(Paths.get(getClass.getResource("/").getPath, "public"))
  }

  def deleteDirIfExists(path: Path): Unit = if (path.toFile.exists) FileUtils.deleteDirectory(path.toFile)
}
