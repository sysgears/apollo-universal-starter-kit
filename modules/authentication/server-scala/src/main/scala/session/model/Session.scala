package session.model

import spray.json._

case class Session(id: Int)

object SessionJsonProtocol extends DefaultJsonProtocol {
  implicit val sessionFormatter = jsonFormat1(Session)
}