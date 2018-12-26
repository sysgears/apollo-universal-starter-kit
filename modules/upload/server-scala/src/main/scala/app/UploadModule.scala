package app

import common.graphql.UserContext
import common.shapes.ServerModule
import common.slick.SchemaInitializer
import core.guice.injection.InjectorProvider._
import graphql.schema.FileSchema
import guice.FileBinding
import repositories.FileSchemaInitializer
import sangria.schema.Field

import scala.collection.mutable

class UploadModule extends ServerModule {

  lazy val fileSchema: FileSchema = inject[FileSchema]
  lazy val fileSchemaInitializer: FileSchemaInitializer = inject[FileSchemaInitializer]

  override lazy val slickSchemas: mutable.HashSet[SchemaInitializer[_]] = mutable.HashSet(fileSchemaInitializer)
  override lazy val queries: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet(fileSchema.queries: _*)
  override lazy val mutations: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet(fileSchema.mutations: _*)

  bindings = new FileBinding
}