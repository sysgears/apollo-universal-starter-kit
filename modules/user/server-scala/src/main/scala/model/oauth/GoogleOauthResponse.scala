package model.oauth

import spray.json.{DefaultJsonProtocol, RootJsonFormat}

case class GoogleOauthResponse(id: String,
                               email: String,
                               verified_email: Boolean,
                               name: String,
                               given_name: String,
                               family_name: String,
                               link: String,
                               picture: String,
                               locale: String)

object GoogleOauthResponse extends DefaultJsonProtocol {
  implicit val googleOauthResponseFormat: RootJsonFormat[GoogleOauthResponse] = jsonFormat9(GoogleOauthResponse.apply)
}