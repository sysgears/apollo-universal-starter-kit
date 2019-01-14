package modules.jwt.model

import spray.json.{DefaultJsonProtocol, RootJsonFormat}

case class Tokens(accessToken: String, refreshToken: String)

object Tokens extends DefaultJsonProtocol {
  implicit val tokensFormat: RootJsonFormat[Tokens] = jsonFormat2(Tokens.apply)
}
