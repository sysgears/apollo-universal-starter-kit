package app

import common.graphql.UserContext
import common.shapes.ServerModule
import common.slick.SchemaInitializer
import core.guice.injection.InjectorProvider._
import graphql.schema.ItemSchema
import guice.ItemBinding
import repositories.ItemSchemaInitializer
import sangria.schema.Field

import scala.collection.mutable

class PaginationModule extends ServerModule {

  lazy val itemSchema: ItemSchema = inject[ItemSchema]
  lazy val itemSchemaInitializer: ItemSchemaInitializer = inject[ItemSchemaInitializer]

  override lazy val slickSchemas: mutable.HashSet[SchemaInitializer[_]] = mutable.HashSet(itemSchemaInitializer)
  override lazy val queries: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet(itemSchema.queries: _*)

  bindings = new ItemBinding
}