package app

import com.google.inject.Inject
import common.shapes.ServerModule
import graphql.schema.ContactSchema

class ContactModule @Inject()(contactSchema: ContactSchema) extends ServerModule {
  mutations ++= contactSchema.mutations
}