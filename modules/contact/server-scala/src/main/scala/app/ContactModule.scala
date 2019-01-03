package app

import common.graphql.UserContext
import common.slick.SchemaInitializer
import core.guice.injection.InjectorProvider._
import graphql.schema.ContactSchema
import guice.ContactBinding
import sangria.schema.Field
import shapes.ServerModule

import scala.collection.mutable

class ContactModule extends ServerModule[UserContext, SchemaInitializer[_]] {

  lazy val contactSchema: ContactSchema = inject[ContactSchema]

  override lazy val mutations: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet(contactSchema.mutations: _*)

  bindings = new ContactBinding
}