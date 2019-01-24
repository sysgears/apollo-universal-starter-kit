package repositories

import com.byteslounge.slickrepo.repository.Repository
import common.errors.{AmbigousResult, NotFound}
import javax.inject.Inject
import model.UserTable.UserTable
import models.DbMessageTable.DbMessageTable
import models.MessageAttachmentTable.MessageAttachmentTable
import models.{AddMessageInput, DbMessage, Message, MessageAttachment}
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext.Implicits.global

class ChatRepository @Inject()(override val driver: JdbcProfile) extends Repository[DbMessage, Int](driver) {

  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[DbMessageTable]
  type TableType = DbMessageTable

  val attachmentTableQuery = TableQuery[MessageAttachmentTable]
  val userTableQuery = TableQuery[UserTable]

  def findAttachment(messageId: Int): DBIO[MessageAttachment] =
    for {
      result <- attachmentTableQuery.filter(_.messageId === messageId).result
      _ = if (result.size != 1) DBIO.failed(AmbigousResult(s"Two or more attachment found for message ID = $messageId"))
      else DBIO.successful()
    } yield result.head

  def messagesPaginated(limit: Int, after: Int): DBIO[List[Message]] = ???

  def getQuotedMessages(messageIds: Set[Int]): DBIO[List[Message]] = ???

  def addMessageWithAttachment(message: AddMessageInput): DBIO[Message] = executeTransactionally {
    for {
      messageId <- tableQuery += DbMessage(
        text = message.text,
        userId = message.userId,
        uuid = message.uuid,
        quotedId = message.quotedId
      )
      _ = if (message.attachment.isDefined) DBIO.successful()
      else DBIO.failed(NotFound(s"Message not contains attachment."))
      attachment = message.attachment.get
      _ <- attachmentTableQuery += MessageAttachment(
        messageId = messageId,
        name = attachment.name,
        contentType = attachment.fileType,
        size = attachment.size,
        path = attachment.path
      )
      username <- userTableQuery.filter(_.id === message.userId.getOrElse(0)).result
      dbMessage <- tableQuery.filter(_.id === messageId).result
    } yield
      Message(
        Some(messageId),
        dbMessage.head.text,
        dbMessage.head.userId,
        dbMessage.head.uuid,
        Some(username.head.username),
        Some(attachment.name),
        Some(attachment.path),
        dbMessage.head.createdAt,
        dbMessage.head.quotedId
      )
  }
}
