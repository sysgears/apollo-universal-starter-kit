package models

case class AddMessageInput(
    text: String,
    userId: Option[Int],
    uuid: Option[String],
    quotedId: Option[Int],
    attachment: Option[Any] = None
)
