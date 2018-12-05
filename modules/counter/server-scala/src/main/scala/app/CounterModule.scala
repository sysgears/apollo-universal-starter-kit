package app

import com.google.inject.Inject
import common.shapes.ServerModule
import graphql.schema.CounterSchema
import repositories.CounterSchemaInitializer

import scala.collection.mutable.ListBuffer

class CounterModule @Inject()(counterSchema: CounterSchema,
                              counterSchemaInitializer: CounterSchemaInitializer) extends ServerModule {

  slickSchemas ++= ListBuffer(counterSchemaInitializer)

  queries ++= counterSchema.queries

  mutations ++= counterSchema.mutations

  subscriptions ++= counterSchema.subscriptions
}