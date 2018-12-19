package app

import com.google.inject.Inject
import common.shapes.ServerModule
import graphql.schema.FileSchema
import repositories.FileSchemaInitializer

import scala.collection.mutable.ListBuffer

class UploadModule @Inject()(fileSchema: FileSchema,
                             fileSchemaInitializer: FileSchemaInitializer) extends ServerModule {

  slickSchemas ++= ListBuffer(fileSchemaInitializer)

  queries ++= fileSchema.queries

  mutations ++= fileSchema.mutations
}