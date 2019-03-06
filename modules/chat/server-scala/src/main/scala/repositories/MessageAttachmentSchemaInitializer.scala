package repositories

import com.google.inject.Inject
import common.slick.SchemaInitializer
import models.MessageAttachmentTable
import models.MessageAttachmentTable.MessageAttachmentTable

import scala.concurrent.ExecutionContext

class MessageAttachmentSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext)
  extends SchemaInitializer[MessageAttachmentTable] {

  import driver.api._

  override val name: String = MessageAttachmentTable.name
  override val table = TableQuery[MessageAttachmentTable]
}
