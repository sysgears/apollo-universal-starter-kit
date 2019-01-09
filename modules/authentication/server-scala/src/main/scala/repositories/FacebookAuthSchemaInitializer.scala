package repositories

import common.slick.SchemaInitializer
import javax.inject.Inject
import model.facebook.FacebookAuthTable
import model.facebook.FacebookAuthTable.FacebookAuthTable
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class FacebookAuthSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext)
  extends SchemaInitializer[FacebookAuthTable] {

  override val name: String = FacebookAuthTable.name
  override val table = TableQuery[FacebookAuthTable]
}
