package core.controllers.graphql.upload

import akka.http.scaladsl.model.{ContentTypes, HttpEntity, Multipart}
import akka.http.scaladsl.model.MediaTypes._
import akka.http.scaladsl.model.StatusCodes._
import akka.util.ByteString
import core.controllers.graphql.TestHelper
import core.controllers.graphql.jsonProtocols.GraphQLMessage
import core.controllers.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import spray.json._

class UploadSpec extends TestHelper {

  val uploadFileMutation = "mutation { uploadFiles(files: [\"null\",\"null\"])}"
  val uploadFileGraphQLMessage = ByteString(GraphQLMessage(uploadFileMutation).toJson.compactPrint)
  val addFilesEntity = Multipart.FormData(
    Multipart.FormData.BodyPart.Strict(
      "operations",
      HttpEntity(`application/json`, uploadFileGraphQLMessage)
    ),
    Multipart.FormData.BodyPart.Strict(
      "map",
      HttpEntity(`application/json`, "{\"0\":[\"variables.files.0\"],\"1\":[\"variables.files.1\"]}")
    ),
    Multipart.FormData.BodyPart.Strict(
      "0",
      HttpEntity(ContentTypes.`text/plain(UTF-8)`, "2,3,5\n7,11,13,17,23\n29,31,37\n"),
      Map("filename" -> "primes.csv")
    ),
    Multipart.FormData.BodyPart.Strict(
      "1",
      HttpEntity(ContentTypes.`text/plain(UTF-8)`, "The\nSecond\nFile\nLargerThanPrevious\n"),
      Map("filename" -> "second.txt")
    )
  )

  "UploadSpec" should {
    "upload files" in {
      Post(endpoint, addFilesEntity) ~> routes ~> check {

        val uploadFilesResult = responseAs[String].parseJson
          .asJsObject.fields("data")
          .asJsObject.fields("uploadFiles")
          .convertTo[Boolean]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        uploadFilesResult shouldBe true
      }
    }
  }
}