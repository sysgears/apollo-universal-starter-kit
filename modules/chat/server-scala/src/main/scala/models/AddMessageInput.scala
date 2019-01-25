package models

import sangria.schema.ScalarType

case class AddMessageInput(
    text: String,
    userId: Option[Int],
    uuid: String,
    quotedId: Option[Int],
    attachment: Option[ScalarType[Unit]] = None
)
