package models
import spray.json.{DefaultJsonProtocol, JsonFormat}

case class Message(
    id: Int,
    text: String,
    userId: Option[Int] = None,
    createdAt: Option[String] = None,
    username: Option[String] = None,
    uuid: Option[String] = None,
    quotedId: Option[Int] = None,
    filename: Option[String] = None,
    path: Option[String] = None
)

object MessageJsonProtocol extends DefaultJsonProtocol {
  implicit val MessageJsonProtocolFormat: JsonFormat[Message] = jsonFormat9(Message)
}
