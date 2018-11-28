package core.slick

import slick.jdbc.SQLiteProfile.api._
import slick.jdbc.meta.MTable
import slick.lifted.TableQuery
import slick.relational.RelationalProfile

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

abstract class TableInitializer[E <: RelationalProfile#Table[_]](name: String, table: TableQuery[E], database: Database) {

  def create(): Future[Unit] = {
    database.run(MTable.getTables(name)).flatMap {
      tables => if (tables.isEmpty) database.run(DBIO.seq(table.schema.create, seedDatabase(table))) else Future.successful()
    }
  }

  def drop(): Future[Unit] = {
    database.run(MTable.getTables(name)).flatMap {
      tables => if (tables.nonEmpty) database.run(DBIO.seq(table.schema.drop)) else Future.successful()
    }
  }

  def seedDatabase[E <: RelationalProfile#Table[_]](tableQuery: TableQuery[E]): DBIO[Unit] = {
    DBIO.successful()
  }
}