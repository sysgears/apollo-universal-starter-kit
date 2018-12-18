package app

import com.google.inject.Inject
import common.shapes.ServerModule
import graphql.schema.ItemSchema
import repositories.ItemSchemaInitializer

import scala.collection.mutable.ListBuffer

class PaginationModule @Inject()(itemSchema: ItemSchema,
                                 itemSchemaInitializer: ItemSchemaInitializer) extends ServerModule {

  slickSchemas ++= ListBuffer(itemSchemaInitializer)

  queries ++= itemSchema.queries
}
