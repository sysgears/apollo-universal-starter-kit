package modules.session

import akka.http.scaladsl.server.{Directive, Directive0, Directive1}
import com.google.inject.Inject
import com.softwaremill.session._
import com.softwaremill.session.SessionDirectives.{invalidateSession, optionalSession, setSession}
import com.softwaremill.session.SessionOptions.{refreshable, usingCookies}
import org.json4s.JValue
import org.slf4j.LoggerFactory

import scala.concurrent.ExecutionContext

class JWTSessionImpl @Inject()(implicit val executionContext: ExecutionContext)
  extends JWTSession[SessionData] {

  override val sessionConfig: SessionConfig = SessionConfig.fromConfig()

  override implicit val serializer: SessionSerializer[SessionData, JValue] = JValueSessionSerializer.caseClass[SessionData]
  override implicit val encoder: JwtSessionEncoder[SessionData] = new JwtSessionEncoder[SessionData]
  override implicit val manager: SessionManager[SessionData] = new SessionManager(sessionConfig)

  override implicit val refreshTokenStorage: InMemoryRefreshTokenStorage[SessionData] = new InMemoryRefreshTokenStorage[SessionData] {
    def log(msg: String): Unit = LoggerFactory.getLogger(this.getClass.getName).info(msg)
  }

  def withNew(value: SessionData): Directive0 = setSession(refreshable, usingCookies, value)

  def withOptional: Directive1[Option[SessionData]] = optionalSession(refreshable, usingCookies)

  def withInvalidating: Directive0 = invalidateSession(refreshable, usingCookies)

  def withChanges(requestSession: Option[SessionData], newSession: Option[SessionData]): Directive0 =
    newSession match {
      case Some(sessionData) if requestSession.isEmpty => withNew(sessionData)
      case None if requestSession.isDefined => withInvalidating
      case _ => Directive.Empty
    }
}
