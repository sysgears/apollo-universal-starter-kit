package app

import com.google.inject.Inject
import common.shapes.ServerModule
import graphql.schema.UserSchema
import repositories.{UserProfileSchemaInitializer, UserSchemaInitializer}

class UserModule @Inject()(userSchema: UserSchema,
                           userSchemaInitializer: UserSchemaInitializer,
                           userProfileSchemaInitializer: UserProfileSchemaInitializer) extends ServerModule {

  slickSchemas ++= userSchemaInitializer :: userProfileSchemaInitializer :: Nil

  queries ++= userSchema.queries
}