package app

import com.google.inject.Inject
import common.shapes.ServerModule
import graphql.schema.PostSchema
import repositories.{CommentSchemaInitializer, PostSchemaInitializer}

class PostModule @Inject()(postSchema: PostSchema,
                           postSchemaInitializer: PostSchemaInitializer,
                           commentSchemaInitializer: CommentSchemaInitializer) extends ServerModule {

  slickSchemas ++= postSchemaInitializer :: commentSchemaInitializer :: Nil

  queries ++= postSchema.queries

  mutations ++= postSchema.mutations

  subscriptions ++= postSchema.subscriptions
}