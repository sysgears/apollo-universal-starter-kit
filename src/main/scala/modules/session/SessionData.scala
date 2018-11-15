package modules.session

import com.softwaremill.session.SessionSerializer
import org.json4s.{JString, JValue}

import scala.util.{Failure, Success, Try}

case class SessionData(id: String)

object SessionData {
  implicit def sessionDataToJValueSessionSerializer: SessionSerializer[SessionData, JValue] =
    new SessionSerializer[SessionData, JValue] {
      override def serialize(t: SessionData) = JString(t.id)
      override def deserialize(s: JValue): Try[SessionData] = failIfNoMatch(s) { case JString(v) => SessionData(v) }
    }

  private def failIfNoMatch[T](s: JValue)(pf: PartialFunction[JValue, T]): Try[T] = {
    pf.lift(s).fold[Try[T]](Failure(new RuntimeException(s"Cannot deserialize $s")))(Success(_))
  }
}
