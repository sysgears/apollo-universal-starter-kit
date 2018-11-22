package modules.user.repositories

import core.slick.{SchemaInitializer, SchemaUtil}
import javax.inject.Inject
import modules.user.model.UserTable
import modules.user.model.UserTable.UserTable
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.{ExecutionContext, Future}

class UserSchemaInitializer @Inject()(database: Database)
                                     (implicit executionContext: ExecutionContext) extends SchemaInitializer
  with SchemaUtil {

  val users: TableQuery[UserTable] = TableQuery[UserTable]

  override def create(): Future[Unit] = {
    withTable(database, users, UserTable.name, _.isEmpty) {
      DBIO.seq(users.schema.create)
    }
  }

  override def drop(): Future[Unit] = {
    withTable(database, users, UserTable.name, _.nonEmpty) {
      DBIO.seq(users.schema.drop)
    }
  }
}