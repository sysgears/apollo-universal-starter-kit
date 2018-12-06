package repositories

import core.slick.SchemaInitializer
import javax.inject.Inject
import model.UserTable
import model.UserTable.UserTable
import slick.jdbc.JdbcBackend.Database
import slick.jdbc.JdbcProfile
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext

class UserSchemaInitializer @Inject()(driver: JdbcProfile,
                                      db: Database,
                                      executionContext: ExecutionContext) extends SchemaInitializer[UserTable](driver, db, executionContext) {

  override val name: String = UserTable.name
  override val table = TableQuery[UserTable]
}