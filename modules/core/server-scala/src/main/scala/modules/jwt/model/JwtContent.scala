package modules.jwt.model

import spray.json.{DefaultJsonProtocol, RootJsonFormat}

case class JwtContent(id: Int)

object JwtContent extends DefaultJsonProtocol {
  implicit val jwtClaimResponseFormat: RootJsonFormat[JwtContent] = jsonFormat1(JwtContent.apply)
}
