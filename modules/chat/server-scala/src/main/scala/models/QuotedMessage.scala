package models

case class QuotedMessage(
    id: Int,
    text: String,
    username: Option[String],
    filename: Option[String],
    path: Option[String]
)
