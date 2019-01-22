package modules.session

import akka.http.scaladsl.server.{Directive, Directive0, Directive1}
import com.google.inject.Inject
import com.softwaremill.session._
import com.softwaremill.session.SessionDirectives.{invalidateSession, optionalSession, setSession}
import com.softwaremill.session.SessionOptions.{refreshable, usingCookies}
import modules.session.SessionData._
import common.Logger

import scala.concurrent.ExecutionContext

@deprecated("use 'SessionService' from default authentication module")
class JWTSessionImpl @Inject()(implicit val executionContext: ExecutionContext)
  extends JWTSession[SessionData]
  with Logger {

  override val sessionConfig: SessionConfig = SessionConfig.fromConfig()

  override implicit val encoder: JwtSessionEncoder[SessionData] = new JwtSessionEncoder[SessionData]
  override implicit val manager: SessionManager[SessionData] = new SessionManager(sessionConfig)
  override implicit val refreshTokenStorage: InMemoryRefreshTokenStorage[SessionData] = (msg: String) => log.info(msg)

  def withNew(sessionData: SessionData): Directive0 = setSession(refreshable, usingCookies, sessionData)

  def withOptional: Directive1[Option[SessionData]] = optionalSession(refreshable, usingCookies)

  def withInvalidating: Directive0 = invalidateSession(refreshable, usingCookies)

  def withChanges(requestSession: Option[SessionData], newSession: Option[SessionData]): Directive0 =
    newSession match {
      case Some(sessionData) if requestSession.isEmpty => withNew(sessionData)
      case None if requestSession.isDefined => withInvalidating
      case _ => Directive.Empty
    }
}
