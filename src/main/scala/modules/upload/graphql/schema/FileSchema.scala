package modules.upload.graphql.schema

import javax.inject.Inject
import akka.stream.ActorMaterializer
import common.{InputUnmarshallerGenerator, Logger}
import core.graphql.{GraphQLSchema, UserContext}
import modules.upload.graphql.resovlers.FileUploadResolver
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

  override def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "uploadFiles",
      fieldType = sangria.schema.BooleanType,
      arguments = Argument(name = "files", argumentType = ListInputType(fileUploadType)) :: Nil,
      resolve = sc => {
        fileUploadResolver.upload(sc.ctx.filesData)
      }
    )
  )
}