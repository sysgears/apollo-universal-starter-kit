package common.slick

import core.guice.injection.InjectorProvider._
import net.codingwell.scalaguice.InjectorExtensions._
import slick.jdbc.meta.MTable
import slick.relational.RelationalProfile

import scala.concurrent.{ExecutionContext, Future}

/**
  * Contains methods for initializing, seed and drop a database.
  * Extending this trait, you will get the implemented functionality
  * that initializes the tables for the received entity.
  *
  */
trait SchemaInitializer[E <: RelationalProfile#Table[_]] {

  /**
    * Specific database
    */
  lazy val database = injector.instance[slick.jdbc.JdbcBackend.Database]

  /**
    * Specific database profile
    */
  lazy val driver = injector.instance[slick.jdbc.JdbcProfile]

  import driver.api._

  /**
    * Thread pool for operations
    */
  implicit val executionContext: ExecutionContext

  /**
    * Name of the database table
    */
  val name: String
  /**
    * Represents a database table
    */
  val table: TableQuery[E]

  private def withDBAction(f: scala.Vector[MTable] => Future[Unit])(implicit executionContext: ExecutionContext) = {
    database.run(MTable.getTables(name)).flatMap(f)
  }

  /**
    * Сreates the table
    */
  def create(): Future[Unit] = {
    withDBAction { tables =>
      if (tables.isEmpty) database.run(DBIO.seq(table.schema.create)) else Future.successful()
    }
  }

  /**
    * Сreates the table and add an init data
    */
  def createAndSeed(): Future[Unit] = {
    withDBAction { tables =>
      if (tables.isEmpty) database.run(DBIO.seq(table.schema.create, initData)) else Future.successful()
    }
  }

  /**
    * Drops the table
    */
  def drop(): Future[Unit] = {
    withDBAction { tables =>
      if (tables.nonEmpty) database.run(DBIO.seq(table.schema.drop)) else Future.successful()
    }
  }

  /**
    * Override and implement this method to prepare init data
    */
  def initData: DBIOAction[_, NoStream, Effect.Write] = {
    table ++= Nil
  }
}