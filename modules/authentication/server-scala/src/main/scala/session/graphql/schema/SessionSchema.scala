package session.graphql.schema

import com.google.inject.Inject
import common.Logger
import common.graphql.UserContext
import sangria.schema.{Field, StringType}
import session.model.Session
import session.services.SessionService

class SessionSchema @Inject()(sessionService: SessionService) extends Logger {

  def mutations: List[Field[UserContext, Unit]] = List(
    Field(
      name = "logout",
      fieldType = StringType,
      arguments = List.empty,
      resolve = ctx =>
        ctx.ctx.requestHeaders.find(_.is("x-token")) match {
          case Some(header) => sessionService.writeSession(ctx.ctx.newCookies, Session(csrfToken = header.value))
          case None => sessionService.createSession(ctx.ctx.newCookies)
      }
    )
  )
}
