package session.model

import spray.json._

case class Session(userId: Option[Int] = None, csrfToken: String)

object SessionJsonProtocol extends DefaultJsonProtocol {
  implicit val sessionFormatter = jsonFormat2(Session)
}
