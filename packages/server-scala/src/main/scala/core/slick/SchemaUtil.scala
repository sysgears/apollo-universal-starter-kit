package core.slick

import slick.dbio.{DBIOAction, NoStream}
import slick.jdbc.meta.MTable
import slick.lifted.TableQuery
import slick.jdbc.SQLiteProfile.api._
import slick.relational.RelationalProfile

import scala.concurrent.{ExecutionContext, Future}

trait SchemaUtil {

  def withTable[E <: RelationalProfile#Table[_]](database: Database,
                                                 query: TableQuery[E],
                                                 name: String,
                                                 condition: Vector[MTable] => Boolean)
                                                (action: DBIOAction[Unit, NoStream, _])
                                                (implicit executionContext: ExecutionContext): Future[Unit] = {
    database.run(MTable.getTables(name)).flatMap {
      tables => if (condition(tables)) database.run(action) else Future.successful()
    }
  }
}