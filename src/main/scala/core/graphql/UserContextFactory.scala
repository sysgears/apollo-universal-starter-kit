package core.graphql

import akka.http.scaladsl.model.HttpRequest

object UserContextFactory {

  def createUserContextForRequest(request: Option[HttpRequest] = None): UserContext = {
    UserContext(request)
  }
}

case class UserContext(request: Option[HttpRequest] = None)