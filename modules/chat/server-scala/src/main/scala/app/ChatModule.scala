package app

import common.graphql.UserContext
import common.slick.SchemaInitializer
import repositories.{DbMessageSchemaInitializer, MessageAttachmentSchemaInitializer}
import core.guice.injection.InjectorProvider._
import graphql.schema.ChatSchema
import guice.ChatBinding
import sangria.schema.Field
import shapes.ServerModule

import scala.collection.mutable

class ChatModule extends ServerModule[UserContext, SchemaInitializer[_]] {

  lazy val chatSchema: ChatSchema = inject[ChatSchema]
  lazy val messageSchemaInitializer: DbMessageSchemaInitializer = inject[DbMessageSchemaInitializer]
  lazy val attachmentSchemaInitializer: MessageAttachmentSchemaInitializer = inject[MessageAttachmentSchemaInitializer]

  override lazy val slickSchemas: mutable.HashSet[SchemaInitializer[_]] =
    mutable.HashSet(messageSchemaInitializer, attachmentSchemaInitializer)

  override lazy val queries: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet(chatSchema.queries: _*)
  override lazy val mutations: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet(chatSchema.mutations: _*)
  override lazy val subscriptions: mutable.HashSet[Field[UserContext, Unit]] =
    mutable.HashSet(chatSchema.subscriptions: _*)

  bindings = new ChatBinding
}
