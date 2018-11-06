package core.graphql

import akka.http.scaladsl.model.HttpRequest

object UserContextFactory {

  def createUserContextForRequest(implicit request: HttpRequest) = {
    UserContext(request)
  }
}

case class UserContext(request: HttpRequest)