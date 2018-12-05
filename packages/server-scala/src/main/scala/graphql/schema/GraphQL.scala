package graphql.schema

import app.GlobalModule
import com.google.inject.{Inject, Singleton}
import core.graphql.UserContext
import sangria.schema.{Field, IntType, ObjectType, Schema}

@Singleton
class GraphQL @Inject()(appServerModule: GlobalModule) {
  val maxQueryDepth = 15
  val maxQueryComplexity = 1000

  private val dummy = ObjectType("Query", List[Field[UserContext, Unit]](Field("dummy", IntType, resolve = _ => 0)))

  val schema: Schema[UserContext, Unit] = sangria.schema.Schema(
    query = if (appServerModule.queries.nonEmpty) ObjectType("Query", appServerModule.queries.toList) else dummy,
    mutation = if (appServerModule.mutations.nonEmpty) Some(ObjectType("Mutation", appServerModule.mutations.toList)) else None,
    subscription = if (appServerModule.subscriptions.nonEmpty) Some(ObjectType("Subscription", appServerModule.subscriptions.toList)) else None
  )
}