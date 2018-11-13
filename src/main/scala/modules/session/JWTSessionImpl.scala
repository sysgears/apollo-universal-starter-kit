package modules.session

import akka.http.scaladsl.server.{Directive0, Directive1}
import com.google.inject.Inject
import com.softwaremill.session._
import com.softwaremill.session.SessionDirectives.{invalidateSession, optionalSession, setSession}
import com.softwaremill.session.SessionOptions.{refreshable, usingCookies}
import org.json4s.JValue
import org.slf4j.LoggerFactory

import scala.concurrent.ExecutionContext

class JWTSessionImpl @Inject()(implicit val executionContext: ExecutionContext)
  extends JWTSession[SessionData] {

  override val sessionConfig: SessionConfig = SessionConfig.default("c05ll3lesrinf39t7mc5h6un6r0c69lgfno69dsak3vabeqamouq4328cuaekros401ajdpkh60rrtpd8ro24rbuqmgtnd1ebag6ljnb65i8a55d482ok7o0nch0bfbe")

  override implicit val serializer: SessionSerializer[SessionData, JValue] = JValueSessionSerializer.caseClass[SessionData]
  override implicit val encoder: JwtSessionEncoder[SessionData] = new JwtSessionEncoder[SessionData]
  override implicit val manager: SessionManager[SessionData] = new SessionManager(sessionConfig)

  override implicit val refreshTokenStorage: InMemoryRefreshTokenStorage[SessionData] = new InMemoryRefreshTokenStorage[SessionData] {
    def log(msg: String): Unit = LoggerFactory.getLogger(this.getClass.getName).info(msg)
  }

  def withNewSession(value: SessionData): Directive0 = setSession(refreshable, usingCookies, value)
  def withOptionalSession: Directive1[Option[SessionData]] = optionalSession(refreshable, usingCookies)
  def withInvalidateSession: Directive0 = invalidateSession(refreshable, usingCookies)
}
