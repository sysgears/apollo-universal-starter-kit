package common.graphql

import akka.http.scaladsl.model.HttpHeader
import akka.http.scaladsl.model.Multipart.FormData
import akka.http.scaladsl.model.headers.HttpCookie
import akka.stream.scaladsl.Source
import modules.socket.WebSocketMessageContext

import scala.collection.mutable.ListBuffer

case class UserContext(
    requestHeaders: List[HttpHeader] = List.empty,
    newHeaders: ListBuffer[HttpHeader] = ListBuffer.empty,
    newCookies: ListBuffer[HttpCookie] = ListBuffer.empty,
    filesData: Source[FormData.BodyPart, Any] = Source.empty,
    webSocketMessageContext: Option[WebSocketMessageContext] = None
)
