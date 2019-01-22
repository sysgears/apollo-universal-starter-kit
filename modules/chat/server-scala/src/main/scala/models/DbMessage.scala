package models

case class DbMessage(id: Int,
                     text: String,
                     userId: Int,
                     createdAt: String,
                     username: String,
                     uuid: String,
                     quotedId: Int,
                     filename: String,
                     path: String)
