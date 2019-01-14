import java.nio.file.{Path, Paths}

import akka.http.scaladsl.model.MediaTypes._
import akka.http.scaladsl.model.StatusCodes._
import akka.http.scaladsl.model.{ContentTypes, HttpEntity, Multipart}
import akka.http.scaladsl.testkit.RouteTestTimeout
import akka.testkit.TestDuration
import akka.util.ByteString
import common.implicits.RichDBIO._
import common.routes.graphql.jsonProtocols.GraphQLMessage
import common.routes.graphql.jsonProtocols.GraphQLMessageJsonProtocol._
import models.FileMetadata
import org.apache.commons.io.FileUtils
import repositories.FileMetadataRepository
import spray.json._

import scala.concurrent.duration._

class UploadSpec extends UploadHelper {
  lazy val fileMetadataRepo: FileMetadataRepository = inject[FileMetadataRepository]
  val uploadFileMutation = "mutation uploadFiles($files: [FileUpload]!) {uploadFiles(files: $files)}"
  val uploadFileVariables = "{\"files\":[null,null]}".asJson.asJsObject
  val uploadFileGraphQLMessage = ByteString(
    GraphQLMessage(uploadFileMutation, Some("uploadFiles"), Some(uploadFileVariables)).toJson.compactPrint
  )
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

  val filesQuery = "query { files { id, name, type, size, path } }"
  val filesQueryGraphQLMessage = ByteString(GraphQLMessage(filesQuery).toJson.compactPrint)
  val filesQueryEntity = HttpEntity(`application/json`, filesQueryGraphQLMessage)

  def removeFileMutation(id: Int) = s"mutation { removeFile(id: $id) }"

  def removeFileMutationGraphQLMessage(id: Int) = ByteString(GraphQLMessage(removeFileMutation(id)).toJson.compactPrint)

  def removeFileEntity(id: Int) = HttpEntity(`application/json`, removeFileMutationGraphQLMessage(id))

  implicit val timeout: RouteTestTimeout = RouteTestTimeout(10.seconds.dilated)

  import models.FileMetadataJsonProtocol._

  "UploadSpec" should {

    "upload files" in {
      Post(endpoint, addFilesEntity) ~> routes ~> check {

        val uploadFilesResult =
          responseAs[String].parseJson.asJsObject.fields("data").asJsObject.fields("uploadFiles").convertTo[Boolean]

        status shouldBe OK
        contentType.mediaType shouldBe `application/json`
        uploadFilesResult shouldBe true
      }
    }

    "get files metadata" in {
      Post(endpoint, addFilesEntity) ~> routes ~> check {
        Post(endpoint, filesQueryEntity) ~> routes ~> check {

          val filesMetadata: List[FileMetadata] = responseAs[String].parseJson.asJsObject
            .fields("data")
            .asJsObject
            .fields("files")
            .convertTo[List[FileMetadata]]

          status shouldBe OK
          contentType.mediaType shouldBe `application/json`
          filesMetadata.size shouldBe 2
        }
      }
    }

    "remove a file by id" in {
      Post(endpoint, addFilesEntity) ~> routes ~> check {
        Post(endpoint, filesQueryEntity) ~> routes ~> check {

          val filesMetadata: List[FileMetadata] = responseAs[String].parseJson.asJsObject
            .fields("data")
            .asJsObject
            .fields("files")
            .convertTo[List[FileMetadata]]

          status shouldBe OK
          contentType.mediaType shouldBe `application/json`
          filesMetadata.size shouldBe 2
          val fileMetadata = filesMetadata.head

          Post(endpoint, removeFileEntity(fileMetadata.id.get)) ~> routes ~> check {

            val removeFileResult =
              responseAs[String].parseJson.asJsObject.fields("data").asJsObject.fields("removeFile").convertTo[Boolean]

            removeFileResult shouldBe true
            await(fileMetadataRepo.findOne(fileMetadata.id.get).run) shouldNot be(defined)
            Paths.get(getClass.getResource("/").getPath, fileMetadata.path).toFile.exists shouldBe false
          }
        }
      }
    }
  }

  override def clean(): Unit = {
    deleteDirIfExists(Paths.get(getClass.getResource("/").getPath, "public"))
  }

  def deleteDirIfExists(path: Path): Unit = if (path.toFile.exists) FileUtils.deleteDirectory(path.toFile)
}
