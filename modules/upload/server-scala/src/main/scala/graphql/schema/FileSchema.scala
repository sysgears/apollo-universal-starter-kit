package graphql.schema

import akka.stream.ActorMaterializer
import common.graphql.UserContext
import common.{InputUnmarshallerGenerator, Logger}
import graphql.resolvers.FileUploadResolver
import javax.inject.Inject
import models.FileMetadata
import sangria.macros.derive.{ObjectTypeName, RenameField, deriveObjectType}
import sangria.schema.{Argument, Field, _}
import spray.json.DefaultJsonProtocol

class FileSchema @Inject()(fileUploadResolver: FileUploadResolver)
                          (implicit val materializer: ActorMaterializer) extends InputUnmarshallerGenerator
  with Logger
  with DefaultJsonProtocol {

  implicit val fileUploadType: ScalarType[Unit] = new ScalarType[Unit](
    name = "FileUpload",
    coerceOutput = (_, _) => Unit,
    coerceUserInput = _ => Right(Unit),
    coerceInput = _ => Right(Unit)
  )

  implicit val fileMetadata: ObjectType[Unit, FileMetadata] = deriveObjectType(ObjectTypeName("File"), RenameField("contentType", "type"))

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "uploadFiles",
      fieldType = sangria.schema.BooleanType,
      arguments = Argument(name = "files", argumentType = ListInputType(OptionInputType(fileUploadType))) :: Nil,
      resolve = sc => {
        fileUploadResolver.uploadFiles(sc.ctx.filesData)
      }
    ),
    Field(
      name = "removeFile",
      fieldType = sangria.schema.BooleanType,
      arguments = Argument(name = "id", argumentType = IntType) :: Nil,
      resolve = sc => fileUploadResolver.removeFile(sc.args.arg[Int]("id"))
    )
  )

  def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "files",
      fieldType = ListType(fileMetadata),
      resolve = _ => fileUploadResolver.files
    )
  )
}