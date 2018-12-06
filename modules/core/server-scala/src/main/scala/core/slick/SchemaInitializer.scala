package core.slick

import slick.jdbc.JdbcBackend.Database
import slick.jdbc.JdbcProfile
import slick.jdbc.meta.MTable
import slick.relational.RelationalProfile

import scala.concurrent.{ExecutionContext, Future}

/**
  * Contains methods for initializing, seed and drop a database.
  * Extending this trait, you will get the implemented functionality
  * that initializes the tables for the received entity.
  *
  */
abstract class SchemaInitializer[E <: RelationalProfile#Table[_]](driver: JdbcProfile,
                                                                  database: Database,
                                                                  implicit val executionContext: ExecutionContext) {

  import driver.api._
  import slick.dbio.{DBIOAction, Effect, NoStream}
  import slick.lifted.TableQuery

  /**
    * Name of the database table
    */
  val name: String
  /**
    * Represents a database table
    */
  val table: TableQuery[E]

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