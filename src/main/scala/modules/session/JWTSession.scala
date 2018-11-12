package modules.session

import com.softwaremill.session._
import org.json4s.JValue

trait JWTSession extends Session[SessionData] {
  val sessionConfig: SessionConfig = SessionConfig.default("c05ll3lesrinf39t7mc5h6un6r0c69lgfno69dsak3vabeqamouq4328cuaekros401ajdpkh60rrtpd8ro24rbuqmgtnd1ebag6ljnb65i8a55d482ok7o0nch0bfbe")

  implicit val serializer: SessionSerializer[SessionData, JValue] = JValueSessionSerializer.caseClass[SessionData]
  implicit val encoder: JwtSessionEncoder[SessionData] = new JwtSessionEncoder[SessionData]
  implicit val manager: SessionManager[SessionData] = new SessionManager(sessionConfig)
}