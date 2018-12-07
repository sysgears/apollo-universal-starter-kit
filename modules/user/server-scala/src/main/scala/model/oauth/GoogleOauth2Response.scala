package model.oauth

import spray.json.{DefaultJsonProtocol, RootJsonFormat}

case class GoogleOauth2Response(id: String,
                                email: String,
                                verified_email: Boolean,
                                name: String,
                                given_name: String,
                                family_name: String,
                                link: String,
                                picture: String,
                                locale: String)

object GoogleOauth2Response extends DefaultJsonProtocol {
  implicit val googleOauthResponseFormat: RootJsonFormat[GoogleOauth2Response] = jsonFormat9(GoogleOauth2Response.apply)
}