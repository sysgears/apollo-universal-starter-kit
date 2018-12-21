package model.google

import spray.json._

case class GoogleOauth2Response(id: String,
                                email: String,
                                name: String)

object GoogleOauth2Response extends DefaultJsonProtocol {

  implicit object GoogleOauth2ResponseFormat extends RootJsonFormat[GoogleOauth2Response] {
    def write(response: GoogleOauth2Response) = JsArray(JsString(response.id), JsString(response.email), JsString(response.name))

    def read(value: JsValue): GoogleOauth2Response = value.asJsObject.getFields("id", "email", "name") match {
      case Seq(JsString(id), JsString(email), JsString(name)) => GoogleOauth2Response(id, email, name)
      case _ => throw DeserializationException("GithubOauth2Response expected")
    }
  }

}