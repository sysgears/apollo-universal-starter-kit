package core.slick

import core.guice.modules.Database
import slick.driver.SQLiteDriver.SchemaDescription
import slick.driver.SQLiteDriver.api._
import slick.jdbc.meta.MTable
import slick.lifted.TableQuery
import slick.relational.RelationalProfile

import scala.concurrent.{ExecutionContext, Future}

trait SchemaUtil {

  def withTable[E <: RelationalProfile#Table[_]](database: Database,
                                                 query: TableQuery[E],
                                                 name: String,
                                                 condition: Vector[MTable] => Boolean)
                                                (doOnSchema: SchemaDescription => DBIO[Unit])
                                                (implicit executionContext: ExecutionContext): Future[Unit] = {
    database.db.run(MTable.getTables(name)).flatMap {
      tables => if (condition(tables)) database.db.run(doOnSchema(query.schema)) else Future.successful()
    }
  }
}