package models

case class EditMessageInput(id: Int, text: String, userId: Option[Int])
