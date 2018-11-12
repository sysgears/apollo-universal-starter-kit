package modules.session

import com.softwaremill.session.MultiValueSessionSerializer

import scala.collection.mutable
import scala.util.Try

case class SessionData(value: mutable.Map[String, String])

object SessionData {
  implicit def serializer: MultiValueSessionSerializer[SessionData] =
    new MultiValueSessionSerializer(
      toMap = data =>
        data.value.toMap,
      fromMap = data =>
        Try(SessionData(mutable.Map(data.toSeq: _*)))
    )
}