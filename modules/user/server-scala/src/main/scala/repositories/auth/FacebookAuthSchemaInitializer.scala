package repositories.auth

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.oauth.facebook.FacebookAuthTable
import model.oauth.facebook.FacebookAuthTable.FacebookAuthTable
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class FacebookAuthSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext) extends SchemaInitializer[FacebookAuthTable] {

  override val context = executionContext
  override val name: String = FacebookAuthTable.name
  override val table = TableQuery[FacebookAuthTable]
}