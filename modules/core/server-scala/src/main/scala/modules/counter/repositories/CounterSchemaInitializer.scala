package modules.counter.repositories

import core.slick.{SchemaLoader, TableInitializer}
import javax.inject.Inject
import modules.counter.models.CounterTable
import modules.counter.models.CounterTable.CounterTable
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

class CounterSchemaInitializer @Inject()(database: Database)
  extends TableInitializer[CounterTable](CounterTable.name, TableQuery[CounterTable], database)
    with SchemaLoader {
}