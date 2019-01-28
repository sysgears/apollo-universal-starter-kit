package repositories

import common.errors.AmbigousResult
import javax.inject.Inject
import model.UserTable.UserTable
import models.DbMessageTable.DbMessageTable
import models.MessageAttachmentTable.MessageAttachmentTable
import models.{DbMessage, Message, MessageAttachment}
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext.Implicits.global

class ChatRepository @Inject()(val driver: JdbcProfile) {

  import driver.api._

  val messageTableQuery = TableQuery[DbMessageTable]
  val attachmentTableQuery = TableQuery[MessageAttachmentTable]
  val userTableQuery = TableQuery[UserTable]

  def saveMessage(message: DbMessage, attachment: Option[MessageAttachment]): DBIO[Message] = ???
//    for {
//    messageId <- messageTableQuery += message
//    savedMessage <- messageTableQuery.filter(_.id === messageId).result.head
//    attachmentId <- if (attachment.isDefined) attachment.get else DBIO.successful()
//    savedAttachment <- attachmentTableQuery.filter(_.id === attachmentId)
//  } yield Message(
//    id = savedMessage.id.get,
//    text = savedMessage.text,
//    userId = savedMessage.userId,
//    created = savedMessage.createdAt,
//    username = "",
//    uuid = savedMessage.uuid
//      quotedId = savedMessage.quotedId,
//    fileName =
//      path =
//        quotedMessage =
//  )

  def findMessage(id: Int): DBIO[Message] = ???

  def findAttachment(messageId: Int): DBIO[MessageAttachment] =
    for {
      result <- attachmentTableQuery.filter(_.messageId === messageId).result
      _ = if (result.size != 1) DBIO.failed(AmbigousResult(s"Two or more attachment found for message ID = $messageId"))
      else DBIO.successful()
    } yield result.head

  def messagesPaginated(limit: Int, after: Int): DBIO[List[Message]] = ???

  def editMessage(id: Int, text: String, userId: Option[Int]): DBIO[Message] = ???

  def deleteMessage(id: Int): DBIO[Message] = ???

}
