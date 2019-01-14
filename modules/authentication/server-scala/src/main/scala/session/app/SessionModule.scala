package session.app

import common.graphql.UserContext
import common.slick.SchemaInitializer
import session.graphql.schema.SessionSchema
import shapes.ServerModule
import core.guice.injection.InjectorProvider._
import sangria.schema.Field

import scala.collection.mutable

class SessionModule extends ServerModule[UserContext, SchemaInitializer[_]] {

  lazy val sessionSchema: SessionSchema = inject[SessionSchema]

  override lazy val mutations: mutable.HashSet[Field[UserContext, Unit]] = mutable.HashSet(sessionSchema.mutations: _*)
}
