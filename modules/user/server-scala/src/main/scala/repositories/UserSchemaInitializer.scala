package repositories

import model.{User, UserTable}
import model.UserTable.UserTable
import common.slick.SchemaInitializer
import javax.inject.Inject
import org.mindrot.jbcrypt.BCrypt

import scala.concurrent.ExecutionContext

class UserSchemaInitializer @Inject()(implicit val executionContext: ExecutionContext) extends SchemaInitializer[UserTable] {

  import driver.api._

  override val name: String = UserTable.name
  override val table = TableQuery[UserTable]

  override def initData: DBIOAction[_, NoStream, Effect.Write] = {
    table ++= User(None, "user", "user@example.com", BCrypt.hashpw("user1234", BCrypt.gensalt), "user", true) ::
      User(None, "admin", "admin@example.com", BCrypt.hashpw("admin123", BCrypt.gensalt), "admin", true) :: Nil
  }
}