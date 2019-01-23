package models

import java.sql.Timestamp

import akka.http.scaladsl.model.DateTime

case class Message(
    id: Option[Int] = None,
    text: String,
    userId: Option[Int] = None,
    uuid: String,
    username: String,
    fileName: Option[String],
    path: Option[String],
    createdAt: Timestamp = new Timestamp(DateTime.now.clicks),
    quotedId: Option[Int]
)
