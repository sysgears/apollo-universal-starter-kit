package models

case class UpdateMessagesPayload(mutation: String, id: Option[Int], node: Message)
