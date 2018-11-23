package repositories

import core.slick.{SchemaInitializer, SchemaUtil}
import javax.inject.Inject
import model.User
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.{ExecutionContext, Future}

class UserSchemaInitializer @Inject()(database: Database)
                                     (implicit executionContext: ExecutionContext) extends SchemaInitializer
  with SchemaUtil {

  val users: TableQuery[User.Table] = TableQuery[User.Table]

  override def create(): Future[Unit] = {
    withTable(database, users, User.name, _.isEmpty) {
      DBIO.seq(users.schema.create)
    }
  }

  override def drop(): Future[Unit] = {
    withTable(database, users, User.name, _.nonEmpty) {
      DBIO.seq(users.schema.drop)
    }
  }
}