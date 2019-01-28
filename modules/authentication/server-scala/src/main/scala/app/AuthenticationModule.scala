package app

import common.graphql.UserContext
import common.slick.SchemaInitializer
import guice.AuthenticationBinding
import shapes.ServerModule

class AuthenticationModule extends ServerModule[UserContext, SchemaInitializer[_]] {
  bindings = new AuthenticationBinding
}
