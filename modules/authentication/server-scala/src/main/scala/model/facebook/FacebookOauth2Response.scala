package model.facebook

import spray.json._

case class FacebookOauth2Response(id: String, email: String, name: String)

object FacebookOauth2Response extends DefaultJsonProtocol {

  implicit object FacebookOauth2ResponseFormat extends RootJsonFormat[FacebookOauth2Response] {
    def write(response: FacebookOauth2Response) =
      JsArray(JsString(response.id), JsString(response.email), JsString(response.name))

    def read(value: JsValue): FacebookOauth2Response = value.asJsObject.getFields("id", "email", "name") match {
      case Seq(JsString(id), JsString(email), JsString(name)) => FacebookOauth2Response(id, email, name)
      case _ => throw DeserializationException("FacebookOauth2Response expected")
    }
  }

}
