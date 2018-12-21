package model.linkedin

import spray.json._

case class LinkedinOauth2Response(id: String,
                                  email: String,
                                  name: String)

object LinkedinOauth2Response extends DefaultJsonProtocol {

  implicit object LinkedInOauth2ResponseFormat extends RootJsonFormat[LinkedinOauth2Response] {
    def write(response: LinkedinOauth2Response) = JsArray(JsString(response.id), JsString(response.email), JsString(response.name))

    def read(value: JsValue): LinkedinOauth2Response = value.asJsObject.getFields("id", "email-address", "formatted-name") match {
      case Seq(JsString(id), JsString(email), JsString(name)) => LinkedinOauth2Response(id, email, name)
      case _ => throw DeserializationException("LinkedInOauth2Response expected")
    }
  }

}