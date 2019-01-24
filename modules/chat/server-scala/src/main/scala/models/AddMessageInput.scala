package models

case class AddMessageInput(
    text: String,
    userId: Option[Int],
    uuid: String,
    quotedId: Option[Int],
    attachment: Option[UploadedFile]
)
