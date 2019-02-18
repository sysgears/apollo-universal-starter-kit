package repositories

import java.nio.file.{Files, Path, Paths}

import com.byteslounge.slickrepo.repository.Repository
import com.google.inject.Inject
import common.errors.{AmbigousResult, NotFound}
import model.UserTable.UserTable
import models.DbMessageTable.DbMessageTable
import models.MessageAttachmentTable.MessageAttachmentTable
import models._
import repositories.PublicResources._
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext

class ChatRepository @Inject()(override val driver: JdbcProfile)(implicit val ec: ExecutionContext)
  extends Repository[DbMessage, Int](driver) {

  import driver.api._

  val tableQuery = TableQuery[DbMessageTable]
  val pkType = implicitly[BaseTypedType[Int]]
  type TableType = DbMessageTable
  type DBActionMessage = DBIOAction[Message, _, Effect]

  val attachmentTableQuery = TableQuery[MessageAttachmentTable]
  val userTableQuery = TableQuery[UserTable]

  def saveMessage(message: DbMessage, attachment: Option[MessageAttachment] = None): DBIO[Message] =
    executeTransactionally {
      for {
        savedDbMessage <- save(message)
        messageId <- savedDbMessage.id.fold[DBIOAction[Int, _, Effect]](
          DBIO.failed(AmbigousResult(s"Message [message=$message] has not been saved"))
        )(DBIO.successful)
        _ <- attachment match {
          case Some(value) =>
            attachmentTableQuery += value.copy(messageId = messageId)
          case _ => DBIO.successful()
        }
        maybeMessage <- findMessage(messageId)
        result <- maybeMessage.fold[DBActionMessage](
          DBIO.failed(NotFound(s"Not found message with [id = $messageId]"))
        )(DBIO.successful)
      } yield result
    }

  def findMessage(id: Int): DBIO[Option[Message]] = executeTransactionally {
    val query = ((tableQuery joinLeft userTableQuery) on (_.userId === _.id) joinLeft attachmentTableQuery) on (_._1.id === _.messageId)
    for {
      dbMessageSeq <- query.filter(_._1._1.id === id).result
      message <- if (dbMessageSeq.size == 1) DBIO.successful(dbMessageSeq.head)
      else DBIO.failed(NotFound(s"Not found message with = $id"))
      ((dbMessage, user), attachment) = message
      id = dbMessage.id.get
      text = dbMessage.text
      createdAt = dbMessage.createdAt.toString
      userId = user.flatMap(_.id)
      username = user.map(_.username)
      uuid = dbMessage.uuid
      quotedId = dbMessage.quotedId
      fileName = attachment.map(_.name)
      path = attachment.map(_.path)
    } yield
      Some(
        Message(id, text, userId, Some(createdAt), username, uuid, quotedId, fileName, path)
      )
  }

  def findQuotedMessage(id: Int): DBIO[Option[QuotedMessage]] = executeTransactionally {
    val query = ((tableQuery joinLeft userTableQuery) on (_.userId === _.id) joinLeft attachmentTableQuery) on (_._1.id === _.messageId)
    for {
      dbMessageSeq <- query.filter(_._1._1.id === id).result
      message <- if (dbMessageSeq.size == 1) DBIO.successful(dbMessageSeq.head)
      else DBIO.failed(NotFound(s"Not found message with ID = $id"))
      ((dbMessage, user), attachment) = message
      id = dbMessage.id.get
      text = dbMessage.text
      username = user.map(_.username)
      fileName = attachment.map(_.name)
      path = attachment.map(_.path)
    } yield
      Some(
        QuotedMessage(id, text, username, fileName, path)
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
      messageEdges = messages.map {
        message =>
          val cursor = messages.indexOf(message) + after + 1
          MessageEdges(message, cursor)
      }
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
    val query = tableQuery.filter {
      message =>
        message.id === id && userId.fold[Rep[Boolean]](true)(uid => message.userId.getOrElse(0) === uid)
    }
    for {
      dbMessageSeq <- query.result
      dbMessage <- if (dbMessageSeq.size == 1) DBIO.successful(dbMessageSeq.head)
      else DBIO.failed(NotFound(s"Not found message with [id=$id], [userId=$userId]"))
      _ <- update(dbMessage.copy(text = text))
      message <- findMessage(id)
      result <- message.fold[DBActionMessage](DBIO.failed(AmbigousResult(s"Could not update message with [id=$id]")))(
        DBIO.successful
      )
    } yield result
  }

  def deleteMessage(id: Int): DBIO[Message] = executeTransactionally {
    for {
      maybeMessage <- findMessage(id)
      message <- maybeMessage
        .fold[DBActionMessage](DBIO.failed(NotFound(s"Not found message with [id=$id]")))(DBIO.successful)
      _ <- delete(DbMessage(id = Some(message.id), text = message.text))
      maybeAttachment <- findAttachment(id)
      _ <- if (maybeAttachment.isDefined) attachmentTableQuery.filter(_.messageId === id).delete else DBIO.successful()
      maybeDeleteMessage <- findOne(id)
      maybeDeleteAttachment <- findAttachment(id)
      _ <- if (maybeDeleteAttachment.isDefined || maybeDeleteMessage.isDefined)
        DBIO.failed(AmbigousResult(s"Message with [id=$id] has not been full deleted"))
      else DBIO.successful()
      isDeleteFile = maybeAttachment.forall(a => Files.deleteIfExists(resourcesDirPath.resolve(a.path)))
      _ <- if (!isDeleteFile)
        DBIO.failed(AmbigousResult(s"The file associated with the message [id = $id] was not deleted"))
      else DBIO.successful()
    } yield message
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
