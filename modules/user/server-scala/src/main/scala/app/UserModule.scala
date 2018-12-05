package app

import com.google.inject.Inject
import common.shapes.ServerModule
import graphql.schema.UserSchema
import repositories.UserSchemaInitializer

import scala.collection.mutable.ListBuffer

class UserModule @Inject()(userSchema: UserSchema,
                           userSchemaInitializer: UserSchemaInitializer) extends ServerModule {

  slickSchemas ++= ListBuffer(userSchemaInitializer)

  mutations ++= userSchema.mutations
}