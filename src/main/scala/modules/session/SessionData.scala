package modules.session

import com.softwaremill.session.MultiValueSessionSerializer

import scala.util.Try

case class SessionData(value: Map[String, String])

object SessionData {
  implicit def serializer: MultiValueSessionSerializer[SessionData] =
    new MultiValueSessionSerializer(
      toMap = data => data.value,
      fromMap = data => Try(SessionData(data))
    )
}
