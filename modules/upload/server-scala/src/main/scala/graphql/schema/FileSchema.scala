package graphql.schema

import akka.stream.ActorMaterializer
import common.{InputUnmarshallerGenerator, Logger}
import core.graphql.{GraphQLSchema, UserContext}
import graphql.resolvers.FileUploadResolver
import javax.inject.Inject
import models.FileMetadata
import sangria.macros.derive.{ObjectTypeName, deriveObjectType}
import sangria.schema.{Argument, Field, _}
import spray.json.DefaultJsonProtocol

class FileSchema @Inject()(fileUploadResolver: FileUploadResolver)
                          (implicit val materializer: ActorMaterializer) extends GraphQLSchema
  with InputUnmarshallerGenerator
  with Logger
  with DefaultJsonProtocol {

  val fileUploadType: ScalarType[OptionType[Nothing]] = new ScalarType[OptionType[Nothing]](
    name = "FileUpload",
    coerceOutput = (_, _) => null,
    coerceUserInput = _ => Right(null),
    coerceInput = _ => Right(null)
  )

  implicit val fileMetadata: ObjectType[Unit, FileMetadata] = deriveObjectType(ObjectTypeName("File"))

  override def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "uploadFiles",
      fieldType = sangria.schema.BooleanType,
      arguments = Argument(name = "files", argumentType = ListInputType(fileUploadType)) :: Nil,
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

  override def queries: List[Field[UserContext, Unit]] = List(
    Field(
      name = "files",
      fieldType = ListType(fileMetadata),
      resolve = _ => fileUploadResolver.files
    )
  )
}