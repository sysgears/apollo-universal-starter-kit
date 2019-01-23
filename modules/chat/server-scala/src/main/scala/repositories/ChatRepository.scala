package repositories

import com.byteslounge.slickrepo.repository.Repository
import javax.inject.Inject
import models.{DbMessage, Message, MessageAttachment}
import models.DbMessageTable.DbMessageTable
import models.MessageAttachmentTable.MessageAttachmentTable
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile

class ChatRepository @Inject()(override val driver: JdbcProfile) extends Repository[DbMessage, Int](driver) {

  import driver.api._

  val pkType = implicitly[BaseTypedType[Int]]
  val tableQuery = TableQuery[DbMessageTable]
  type TableType = DbMessageTable

  val attachmentTableQuery = TableQuery[MessageAttachmentTable]

  def findAttachment(messageId: Int): DBIO[Option[MessageAttachment]] = ???

  def messagesPaginated(limit: Int, after: Int): DBIO[List[Message]] = ???

  def getQuotedMessages(messageIds: Set[Int]): DBIO[List[Message]] = ???

  def addMessageWithAttachment(message: DbMessage, attachment: MessageAttachment): DBIO[Message] = ???
}
