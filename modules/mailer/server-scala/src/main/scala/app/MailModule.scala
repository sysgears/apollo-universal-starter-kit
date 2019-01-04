package app

import common.graphql.UserContext
import common.slick.SchemaInitializer
import guice.MailBinding
import shapes.ServerModule

class MailModule extends ServerModule[UserContext, SchemaInitializer[_]] {
  bindings = new MailBinding
}
