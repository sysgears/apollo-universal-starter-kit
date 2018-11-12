package modules.session

import akka.http.scaladsl.server.{Directive0, Directive1}
import com.softwaremill.session.SessionDirectives.{invalidateSession, optionalSession, setSession}
import com.softwaremill.session.SessionOptions.{oneOff, usingCookies}
import com.softwaremill.session._

trait Session[T] {
  val sessionConfig: SessionConfig

  implicit val manager: SessionManager[T]

  def withNewSession(value: T): Directive0 = setSession(oneOff, usingCookies, value)
  val withOptionalSession: Directive1[Option[T]] = optionalSession(oneOff, usingCookies)
  val withInvalidateSession: Directive0 = invalidateSession(oneOff, usingCookies)
}