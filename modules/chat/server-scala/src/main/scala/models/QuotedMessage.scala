package models
import spray.json.{DefaultJsonProtocol, JsonFormat}

case class QuotedMessage(
    id: Int,
    text: String,
    username: Option[String],
    filename: Option[String],
    path: Option[String]
)

object QuotedMessageJsonProtocol extends DefaultJsonProtocol {
  implicit val QuotedMessageJsonProtocolFormat: JsonFormat[QuotedMessage] = jsonFormat5(QuotedMessage)
}
