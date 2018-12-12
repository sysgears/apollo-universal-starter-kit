package core.slick

import core.guice.injection.Injecting
import slick.jdbc.meta.MTable
import slick.relational.RelationalProfile

import scala.concurrent.{ExecutionContext, Future}

/**
  * Contains methods for initializing, seed and drop a database.
  * Extending this trait, you will get the implemented functionality
  * that initializes the tables for the received entity.
  *
  */
trait SchemaInitializer[E <: RelationalProfile#Table[_]] extends Injecting {

  /**
    * Specific database
    */
  val database = inject[slick.jdbc.JdbcBackend.Database]

  /**
    * Specific database profile
    */
  val driver = inject[slick.jdbc.JdbcProfile]

  import driver.api._

  /**
    * Thread pool for operations
    */
  val context: ExecutionContext

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
    }(context)
  }

  /**
    * Drops the table
    */
  def drop(): Future[Unit] = {
    database.run(MTable.getTables(name)).flatMap {
      tables => if (tables.nonEmpty) database.run(DBIO.seq(table.schema.drop)) else Future.successful()
    }(context)
  }

  /**
    * Override and implement this method to fill the database.
    */
  def seedDatabase(tableQuery: TableQuery[E]): DBIOAction[_, NoStream, Effect.Write] = {
    DBIO.successful()
  }
}