package repositories

import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Inject
import common.errors.AmbigousResult
import model.UserTable.UserTable
import models.DbMessageTable.DbMessageTable
import models.MessageAttachmentTable.MessageAttachmentTable
import models.{DbMessage, Message, MessageAttachment, QuotedMessage}
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext.Implicits.global

class ChatRepository @Inject()(override val driver: JdbcProfile) extends Repository[DbMessage, Int](driver) {

  import driver.api._

  val tableQuery = TableQuery[DbMessageTable]
  val pkType = implicitly[BaseTypedType[Int]]
  type TableType = DbMessageTable

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

  def findMessage(id: Int): DBIO[Option[Message]] = {
    val query = ((tableQuery joinLeft userTableQuery) on (_.userId === _.id) joinLeft attachmentTableQuery) on (_._1.id === _.messageId)
    for {
      dbMessageSeq <- query.filter(_._1._1.id === id).result
      message <- if (dbMessageSeq.lengthCompare(2) < 0) DBIO.successful(dbMessageSeq.head)
      else DBIO.failed(AmbigousResult(s"Two or more entities found for message ID = $id"))
      attachment <- attachmentTableQuery.filter(_.messageId === id).result
      _ = if (attachment.lengthCompare(2) < 0)
        DBIO.failed(AmbigousResult(s"Two or more attachment found for message ID"))
      else DBIO.successful()
      id = message._1._1.id.get
      text = message._1._1.text
      createdAt = message._1._1.createdAt.toString
      maybeUser = message._1._2
      username = maybeUser.get.username
      uuid = message._1._1.uuid
      quotedId = message._1._1.quotedId
      fileName = if (attachment.nonEmpty) attachment.head.name else ""
      path = if (attachment.nonEmpty) attachment.head.path else ""
    } yield
      Some(
        Message(id, text, maybeUser.get.id, Some(createdAt), Some(username), uuid, quotedId, Some(fileName), Some(path))
      )
  }

  def findQuotedMessage(id: Int): DBIO[Option[QuotedMessage]] = {
    val query = ((tableQuery joinLeft userTableQuery) on (_.userId === _.id) joinLeft attachmentTableQuery) on (_._1.id === _.messageId)
    for {
      dbMessageSeq <- query.filter(_._1._1.id === id).result
      message <- if (dbMessageSeq.lengthCompare(2) < 0) DBIO.successful(dbMessageSeq.head)
      else DBIO.failed(AmbigousResult(s"Two or more entities found for message ID = $id"))
      attachment <- attachmentTableQuery.filter(_.messageId === id).result
      _ = if (attachment.lengthCompare(2) < 0)
        DBIO.failed(AmbigousResult(s"Two or more attachment found for message ID"))
      else DBIO.successful()
      id = message._1._1.id.get
      text = message._1._1.text
      maybeUser = message._1._2
      username = maybeUser.get.username
      fileName = if (attachment.nonEmpty) attachment.head.name else ""
      path = if (attachment.nonEmpty) attachment.head.path else ""
    } yield
      Some(
        QuotedMessage(id, text, Some(username), Some(fileName), Some(path))
      )
  }

  def messagesPaginated(limit: Int, after: Int): DBIO[List[Message]] = ???

  def editMessage(id: Int, text: String, userId: Option[Int]): DBIO[Message] = ???

  def deleteMessage(id: Int): DBIO[Message] = ???

}
