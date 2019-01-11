import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.MediaTypes.`application/json`
import akka.http.scaladsl.model.StatusCodes.OK
import akka.http.scaladsl.testkit.RouteTestTimeout
import akka.testkit.TestDuration
import akka.util.ByteString
import common.FieldError
import common.routes.graphql.jsonProtocols.GraphQLMessage
import common.routes.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import models.ContactPayload
import spray.json._

import scala.concurrent.duration._

class ContactSpec extends ContactSpecHelper {

  "Contact" must {

    implicit val contactPayloadJsonReader: ContactPayloadJsonReader.type = ContactPayloadJsonReader
    implicit val timeout: RouteTestTimeout = RouteTestTimeout(10.seconds.dilated)

    "send a mail" in {
      val mutation = "mutation contact($input: ContactInput!) { contact(input: $input) { errors { message } } }"
      val variables =
        """{"input":
          |{"name": "test_user",
          |"email": "test_user@gmail.com",
          |"content": "Test message"}}""".stripMargin.parseJson.asJsObject
      val graphQLMessage = ByteString(GraphQLMessage(mutation, None, Some(variables)).toJson.compactPrint)
      val entity = HttpEntity(`application/json`, graphQLMessage)
      Post(endpoint, entity) ~> routes ~> check {
        val contactPayload = responseAs[String].parseJson.convertTo[ContactPayload]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`

        contactPayload.errors should not be defined
      }
    }
  }

  override def clean(): Unit = {}
}

object ContactPayloadJsonReader extends JsonReader[ContactPayload] with DefaultJsonProtocol {
  override def read(json: JsValue): ContactPayload = {
    json.asJsObject.getFields("data", "errors") match {
      case Seq(_) => ContactPayload(None)
      case Seq(_, JsArray(errors)) =>
        val errorsList = errors.map {
          error =>
            FieldError("", error.asJsObject.fields.head._2.convertTo[String])
        }.toList
        ContactPayload(Some(errorsList))
      case _ => throw DeserializationException("")
    }
  }
}
