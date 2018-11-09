package core.graphql

import akka.http.scaladsl.model.HttpHeader
import akka.http.scaladsl.model.headers.HttpCookie

import scala.collection.mutable.ListBuffer

class UserContextFactory {

  def createContext(requestHeaders: List[HttpHeader] = List.empty,
                    newHeaders: ListBuffer[HttpHeader] = ListBuffer.empty,
                    newCookies: ListBuffer[HttpCookie] = ListBuffer.empty): UserContext = {
    UserContext(requestHeaders, newHeaders, newCookies)
  }
}

case class UserContext(requestHeaders: List[HttpHeader],
                       newHeaders: ListBuffer[HttpHeader],
                       newCookies: ListBuffer[HttpCookie])