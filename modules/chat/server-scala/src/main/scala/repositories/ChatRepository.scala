package repositories

import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Inject
import common.errors.{AmbigousResult, NotFound}
import model.UserTable.UserTable
import models.DbMessageTable.DbMessageTable
import models.MessageAttachmentTable.MessageAttachmentTable
import models._
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

  val emptyStr = ""

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

  def findMessage(id: Int): DBIO[Option[Message]] = executeTransactionally {
    val query = ((tableQuery joinLeft userTableQuery) on (_.userId === _.id) joinLeft attachmentTableQuery) on (_._1.id === _.messageId)
    for {
      dbMessageSeq <- query.filter(_._1._1.id === id).result
      message <- if (dbMessageSeq.size == 1) DBIO.successful(dbMessageSeq.head)
      else DBIO.failed(NotFound(s"Not found message with = $id"))
      attachmentSeq <- attachmentTableQuery.filter(_.messageId === id).result
      attachment = attachmentSeq.headOption
      id = message._1._1.id.get
      text = message._1._1.text
      createdAt = message._1._1.createdAt.toString
      maybeUser = message._1._2
      username = if (maybeUser.isDefined) maybeUser.get.username else emptyStr
      uuid = message._1._1.uuid
      quotedId = message._1._1.quotedId
      fileName = if (attachment.isDefined) attachment.get.name else emptyStr
      path = if (attachment.isDefined) attachment.get.path else emptyStr
    } yield
      Some(
        Message(id, text, maybeUser.get.id, Some(createdAt), Some(username), uuid, quotedId, Some(fileName), Some(path))
      )
  }

  def findQuotedMessage(id: Int): DBIO[Option[QuotedMessage]] = executeTransactionally {
    val query = ((tableQuery joinLeft userTableQuery) on (_.userId === _.id) joinLeft attachmentTableQuery) on (_._1.id === _.messageId)
    for {
      dbMessageSeq <- query.filter(_._1._1.id === id).result
      message <- if (dbMessageSeq.size == 1) DBIO.successful(dbMessageSeq.head)
      else DBIO.failed(NotFound(s"Not found message with ID = $id"))
      attachmentSeq <- attachmentTableQuery.filter(_.messageId === id).result
      attachment = attachmentSeq.headOption
      id = message._1._1.id.get
      text = message._1._1.text
      maybeUser = message._1._2
      username = maybeUser.get.username
      fileName = if (attachment.isDefined) attachment.get.name else emptyStr
      path = if (attachment.isDefined) attachment.get.path else emptyStr
    } yield
      Some(
        QuotedMessage(id, text, Some(username), Some(fileName), Some(path))
      )
  }

  def messagesPaginated(limit: Int, after: Int): DBIO[Messages] = executeTransactionally {
    for {
      totalCount <- tableQuery.size.result
      _ <- if (after > totalCount)
        DBIO.failed(AmbigousResult(s"Wrong pagination parameter [after=$after], because [totalCount=$totalCount]"))
      else DBIO.successful()
      dbMessageSeq <- tableQuery.drop(after).take(limit).result
      maybeMessagesList <- DBIO.sequence(dbMessageSeq.map(dbMessage => findMessage(dbMessage.id.get)))
      messages = maybeMessagesList.flatten.toList
      messageEdges = messages.map(message => {
        val cursor = messages.indexOf(message) + after + 1
        MessageEdges(message, cursor)
      })
      endCursor = after + messages.size
      hasNextPage = (totalCount - (after + limit)) > 0
    } yield
      Messages(
        totalCount,
        messageEdges,
        MessagePageInfo(
          endCursor,
          hasNextPage
        )
      )
  }

  def editMessage(id: Int, text: String, userId: Option[Int]): DBIO[Message] = executeTransactionally {
    for {
      dbMessageSeq <- tableQuery
        .filter(
          message =>
            message.id === id &&
              (if (userId.isDefined) message.id === userId.get
               else true)
        )
        .result
      dbMessage <- if (dbMessageSeq.size == 1) DBIO.successful(dbMessageSeq.head)
      else DBIO.failed(NotFound(s"Not found message with [id=$id], [userId=$userId]"))
      _ <- update(dbMessage.copy(text = text))
      message <- findMessage(id)
      result <- if (message.isDefined) DBIO.successful(message.get)
      else DBIO.failed(AmbigousResult(s"Could not update message with [id=$id]"))
    } yield result
  }

  def deleteMessage(id: Int): DBIO[Option[Message]] = executeTransactionally {
    for {
      maybeMessage <- findMessage(id)
      maybeDbMessage <- findOne(id)
      deleteDbMessage <- if (maybeDbMessage.isDefined) delete(maybeDbMessage.get)
      else DBIO.failed(AmbigousResult(s"Message with [id=$id] has not been deleted"))
      maybeAttachment <- findAttachment(id)
      deleteAttachment <- if (maybeAttachment.isDefined) attachmentTableQuery.filter(_.messageId === id).delete
      else DBIO.successful()
      maybeDeleteMessage <- findOne(id)
      maybeDeleteAttachment <- findAttachment(id)
      _ <- if (maybeDeleteAttachment.isDefined || maybeDeleteMessage.isDefined)
        DBIO.failed(AmbigousResult(s"Message with [id=$id] has not been full deleted"))
      else DBIO.successful()
      isDeleteFile = if (maybeAttachment.isDefined) {
        Files.deleteIfExists(resourcesDirPath.resolve(maybeAttachment.get.path))
        true
      } else true
      _ <- if (isDeleteFile) DBIO.successful()
      else DBIO.failed(AmbigousResult(s"The file associated with the message [id = $id] was not deleted"))
    } yield maybeMessage
  }

  def findAttachment(messageId: Int): DBIO[Option[MessageAttachment]] =
    for {
      attachmentSeq <- attachmentTableQuery.filter(_.messageId === messageId).result
      attachment = attachmentSeq.headOption
    } yield attachment
}

object PublicResources {
  val resourcesDirPath: Path = Paths.get(getClass.getResource("/").getPath)
  val publicDirPath: Path = resourcesDirPath.resolve("public")

}
