import com.google.inject.Inject
import common.shapes.ServerModule
import graphql.schema.CounterSchema
import repositories.CounterSchemaInitializer

import scala.collection.mutable.ListBuffer

class CounterServerModule @Inject()(counterSchema: CounterSchema,
                                    counterSchemaInitializer: CounterSchemaInitializer) extends ServerModule {

  slickSchemas ++= ListBuffer(counterSchemaInitializer)

  queries ++= counterSchema.queries

  mutations ++= counterSchema.mutations

  subscriptions ++= counterSchema.subscriptions
}