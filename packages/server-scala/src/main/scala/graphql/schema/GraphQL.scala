package graphql.schema

import app.GlobalModule
import com.google.inject.{Inject, Singleton}
import core.graphql.UserContext
import sangria.schema.{Field, IntType, ObjectType, Schema}

@Singleton
class GraphQL @Inject()(globalModule: GlobalModule) {
  val maxQueryDepth = 15
  val maxQueryComplexity = 1000

  private val dummy = ObjectType("Query", List[Field[UserContext, Unit]](Field("dummy", IntType, resolve = _ => 0)))

  val schema: Schema[UserContext, Unit] = sangria.schema.Schema(
    query = if (globalModule.queries.nonEmpty) ObjectType("Query", globalModule.queries.toList) else dummy,
    mutation = if (globalModule.mutations.nonEmpty) Some(ObjectType("Mutation", globalModule.mutations.toList)) else None,
    subscription = if (globalModule.subscriptions.nonEmpty) Some(ObjectType("Subscription", globalModule.subscriptions.toList)) else None
  )
}