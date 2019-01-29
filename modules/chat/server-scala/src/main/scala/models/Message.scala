package models

case class Message(
    id: Int,
    text: String,
    userId: Option[Int] = None,
    createdAt: Option[String] = None,
    username: Option[String] = None,
    uuid: Option[String] = None,
    quotedId: Option[Int] = None,
    fileName: Option[String] = None,
    path: Option[String] = None
)
