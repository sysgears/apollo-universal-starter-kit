package models

import java.sql.Timestamp

import akka.http.scaladsl.model.DateTime

case class Message(
    id: Option[Int] = None,
    text: String,
    userId: Option[Int] = None,
    createdAt: Timestamp = new Timestamp(DateTime.now.clicks),
    username: Option[String],
    uuid: String,
    quotedId: Option[Int],
    fileName: Option[String],
    path: Option[String],
    quotedMessage: QuotedMessage
)
