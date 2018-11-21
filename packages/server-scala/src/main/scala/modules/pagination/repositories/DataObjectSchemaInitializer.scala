package modules.pagination.repositories

import core.slick.{SchemaInitializer, SchemaUtil}
import javax.inject.Inject
import modules.pagination.model.DataObject
import slick.jdbc.SQLiteProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.{ExecutionContext, Future}

class DataObjectSchemaInitializer @Inject()(database: Database)
                                           (implicit executionContext: ExecutionContext) extends SchemaInitializer with SchemaUtil {

  val objects: TableQuery[DataObject.Table] = TableQuery[DataObject.Table]

  override def create(): Future[Unit] = {
    withTable(database, objects, DataObject.name, _.isEmpty){
      DBIO.seq(objects.schema.create)
    }
  }

  override def drop(): Future[Unit] = {
    withTable(database, objects, DataObject.name, _.nonEmpty){
      DBIO.seq(objects.schema.drop)
    }
  }
}