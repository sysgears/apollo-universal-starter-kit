package common.graphql.schema

import common.graphql.UserContext
import common.slick.SchemaInitializer
import sangria.schema.{Field, IntType, ObjectType, Schema}
import shapes.ServerModule

trait GraphQL {

  val serverModule: ServerModule[UserContext, SchemaInitializer[_]]

  val maxQueryDepth = 15
  val maxQueryComplexity = 1000

  private val dummy = ObjectType("Query", List[Field[UserContext, Unit]](Field("dummy", IntType, resolve = _ => 0)))

  lazy val schema: Schema[UserContext, Unit] = serverModule.extensions.foldLeft(
    sangria.schema.Schema(
      query = if (serverModule.queries.nonEmpty) ObjectType("Query", serverModule.queries.toList) else dummy,
      mutation =
        if (serverModule.mutations.nonEmpty) Some(ObjectType("Mutation", serverModule.mutations.toList)) else None,
      subscription =
        if (serverModule.subscriptions.nonEmpty) Some(ObjectType("Subscription", serverModule.subscriptions.toList))
        else None
    )
  )((schema, extension) => schema.extend(extension.document, extension.builder))
}
