package models

case class Message(
    id: Int,
    text: String,
    userId: Option[Int] = None,
    createdAt: Option[String],
    username: Option[String],
    uuid: Option[String],
    quotedId: Option[Int],
    fileName: Option[String],
    path: Option[String],
    quotedMessage: Option[QuotedMessage]
)
