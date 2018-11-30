package core.slick

import slick.jdbc.SQLiteProfile.api._
import slick.jdbc.meta.MTable
import slick.lifted.TableQuery
import slick.relational.RelationalProfile

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * Contains methods for initializing, seed and drop a database.
  * Extending this trait, you will get the implemented functionality
  * that initializes the tables for the received entity.
  *
  */
trait SchemaInitializer[E <: RelationalProfile#Table[_]] {

  /**
    * Name of the database table
    */
  val name: String
  /**
    * Represents a database table
    */
  val table: TableQuery[E]
  /**
    * Database in which operations will be performed
    */
  val db: Database

  /**
    * Сreates the table
    */
  def create(): Future[Unit] = {
    db.run(MTable.getTables(name)).flatMap {
      tables => if (tables.isEmpty) db.run(DBIO.seq(table.schema.create, seedDatabase(table))) else Future.successful()
    }
  }

  /**
    * Drops the table
    */
  def drop(): Future[Unit] = {
    db.run(MTable.getTables(name)).flatMap {
      tables => if (tables.nonEmpty) db.run(DBIO.seq(table.schema.drop)) else Future.successful()
    }
  }

  /**
    * Override and implement this method to fill the database.
    */
  def seedDatabase(tableQuery: TableQuery[E]): DBIOAction[_, NoStream, Effect.Write] = {
    DBIO.successful()
  }
}