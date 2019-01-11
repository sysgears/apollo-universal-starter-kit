package session.graphql.schema

import com.google.inject.Inject
import common.Logger
import common.graphql.UserContext
import sangria.schema.{Field, StringType}
import session.services.SessionService

class SessionSchema @Inject()(sessionService: SessionService) extends Logger {

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "logout",
      fieldType = StringType,
      arguments = List.empty,
      resolve = ctx => sessionService.createSession(ctx.ctx.newCookies)
    )
  )
}
