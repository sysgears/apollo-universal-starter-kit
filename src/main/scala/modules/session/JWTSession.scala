package modules.session

import akka.http.scaladsl.server.{Directive0, Directive1}
import com.softwaremill.session.SessionDirectives.{invalidateSession, optionalSession, setSession}
import com.softwaremill.session.SessionOptions.{oneOff, usingCookies}
import com.softwaremill.session._
import org.json4s.JValue

trait JWTSession[T] {
  val defaultSessionConfig: SessionConfig = SessionConfig.default("c05ll3lesrinf39t7mc5h6un6r0c69lgfno69dsak3vabeqamouq4328cuaekros401ajdpkh60rrtpd8ro24rbuqmgtnd1ebag6ljnb65i8a55d482ok7o0nch0bfbe")

  implicit val serializer: SessionSerializer[T, JValue] = JValueSessionSerializer.caseClass[T]
  implicit val encoder: JwtSessionEncoder[T] = new JwtSessionEncoder[T]
  implicit val manager: SessionManager[T] = new SessionManager(defaultSessionConfig)

  def withNewSession(newSession: T): Directive0 = setSession(oneOff, usingCookies, newSession)
  val withOptionalSession: Directive1[Option[T]] = optionalSession(oneOff, usingCookies)
  val withInvalidateSession: Directive0 = invalidateSession(oneOff, usingCookies)
}
