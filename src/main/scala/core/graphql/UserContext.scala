package core.graphql

import akka.http.scaladsl.model.HttpHeader
import akka.http.scaladsl.model.headers.HttpCookie

import scala.collection.mutable
import scala.collection.mutable.ListBuffer

case class UserContext(requestHeaders: List[HttpHeader] = List.empty,
                       newHeaders: ListBuffer[HttpHeader] = ListBuffer.empty,
                       newCookies: ListBuffer[HttpCookie] = ListBuffer.empty,
                       storedSession: Map[String, String] = Map.empty,
                       newSession: mutable.Map[String, String] = mutable.Map.empty)