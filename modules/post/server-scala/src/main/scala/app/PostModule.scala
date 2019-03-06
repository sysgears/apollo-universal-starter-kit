package app

import com.google.inject.util.Modules.combine
import graphql.schema.PostSchema
import repositories.{CommentSchemaInitializer, PostSchemaInitializer}
import common.graphql.UserContext
import common.slick.SchemaInitializer
import core.guice.injection.InjectorProvider._
import guice.{CommentBinding, PostBinding}
import sangria.schema.Field
import shapes.ServerModule

import scala.collection.mutable

class PostModule extends ServerModule[UserContext, SchemaInitializer[_]] {

  lazy val postSchema: PostSchema = inject[PostSchema]
  lazy val postSchemaInitializer: PostSchemaInitializer = inject[PostSchemaInitializer]
  lazy val commentSchemaInitializer: CommentSchemaInitializer = inject[CommentSchemaInitializer]

  override lazy val slickSchemas: mutable.HashSet[SchemaInitializer[_]] =
    mutable.HashSet(postSchemaInitializer, commentSchemaInitializer)
  override lazy val queries: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet(postSchema.queries: _*)
  override lazy val mutations: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet(postSchema.mutations: _*)
  override lazy val subscriptions: mutable.HashSet[Field[UserContext, Unit]] =
    mutable.HashSet(postSchema.subscriptions: _*)

  bindings = combine(new PostBinding, new CommentBinding)
}
