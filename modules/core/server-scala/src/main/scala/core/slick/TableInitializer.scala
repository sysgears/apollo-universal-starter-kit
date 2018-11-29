package core.slick

import slick.jdbc.SQLiteProfile.api._
import slick.jdbc.meta.MTable
import slick.lifted.TableQuery
import slick.relational.RelationalProfile

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * Contains methods for initializing, seed and drop a database.
  * Inheriting this class, you will get the implemented functionality
  * that initializes the tables for the received entity.
  *
  * @param name name of the database table
  * @param table represents a database table
  * @param database base in which operations will be performed
  */
abstract class TableInitializer[E <: RelationalProfile#Table[_]](name: String, table: TableQuery[E], database: Database) {

  /**
    * Сreates the table
    */
  def create(): Future[Unit] = {
    database.run(MTable.getTables(name)).flatMap {
      tables => if (tables.isEmpty) database.run(DBIO.seq(table.schema.create, seedDatabase(table))) else Future.successful()
    }
  }

  /**
    * Drops the table
    */
  def drop(): Future[Unit] = {
    database.run(MTable.getTables(name)).flatMap {
      tables => if (tables.nonEmpty) database.run(DBIO.seq(table.schema.drop)) else Future.successful()
    }
  }

  /**
    * Override and implement this method to fill the database.
    */
  def seedDatabase(tableQuery: TableQuery[E]): DBIOAction[_, NoStream, Effect.Write] = {
    DBIO.successful()
  }
}