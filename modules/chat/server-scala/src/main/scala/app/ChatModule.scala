package app

import common.graphql.UserContext
import common.slick.SchemaInitializer
import repositories.{DbMessageSchemaInitializer, MessageAttachmentSchemaInitializer}
import core.guice.injection.InjectorProvider._
import guice.ChatBinding
import shapes.ServerModule

import scala.collection.mutable

class ChatModule extends ServerModule[UserContext, SchemaInitializer[_]] {

  lazy val messageSchemaInitializer: DbMessageSchemaInitializer = inject[DbMessageSchemaInitializer]
  lazy val attachmentSchemaInitializer: MessageAttachmentSchemaInitializer = inject[MessageAttachmentSchemaInitializer]

  override lazy val slickSchemas: mutable.HashSet[SchemaInitializer[_]] =
    mutable.HashSet(messageSchemaInitializer, attachmentSchemaInitializer)

  bindings = new ChatBinding
}
