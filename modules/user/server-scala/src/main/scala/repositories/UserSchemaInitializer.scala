package repositories

import core.slick.{SchemaLoader, TableInitializer}
import javax.inject.Inject
import model.UserTable
import model.UserTable.UserTable
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

class UserSchemaInitializer @Inject()(database: Database)
  extends TableInitializer[UserTable](UserTable.name, TableQuery[UserTable], database)
    with SchemaLoader {
}