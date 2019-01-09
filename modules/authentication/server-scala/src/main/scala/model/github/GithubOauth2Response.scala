package model.github

import spray.json._

case class GithubOauth2Response(id: Int, email: String, name: String)

object GithubOauth2Response extends DefaultJsonProtocol {

  implicit object GithubOauth2ResponseFormat extends RootJsonFormat[GithubOauth2Response] {
    def write(response: GithubOauth2Response) =
      JsArray(JsNumber(response.id), JsString(response.email), JsString(response.name))

    def read(value: JsValue): GithubOauth2Response = value.asJsObject.getFields("id", "email", "name") match {
      case Seq(JsNumber(id), JsString(email), JsString(name)) => GithubOauth2Response(id.toInt, email, name)
      case _ => throw DeserializationException("GithubOauth2Response expected")
    }
  }

}
