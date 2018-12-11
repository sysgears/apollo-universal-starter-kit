package model.oauth.facebook

import spray.json.{DefaultJsonProtocol, RootJsonFormat}

case class FacebookOauth2Response(id: String,
                                  email: String,
                                  name: String)

object FacebookOauth2Response extends DefaultJsonProtocol {
  implicit val facebookOauthResponseFormat: RootJsonFormat[FacebookOauth2Response] = jsonFormat3(FacebookOauth2Response.apply)
}