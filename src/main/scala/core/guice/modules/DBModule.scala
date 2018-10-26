package core.guice.modules

import com.google.inject.Provides
import com.typesafe.config.Config
import net.codingwell.scalaguice.ScalaModule
import slick.jdbc.JdbcBackend
import slick.jdbc.SQLiteProfile.api._

class DBModule extends ScalaModule {

  @Provides
  def database(config: Config,
               testDatabase: TestDatabase,
               starterKitDatabase: StarterKitDatabase): Database = Option(System.getenv("env")) match {
    case Some(_) => testDatabase
    case _ => starterKitDatabase
  }

  @Provides
  def testDatabase(config: Config): TestDatabase = new TestDatabase {
    override def db = Database.forConfig("slick.dbs.test")
  }

  @Provides
  def defaultDatabase(config: Config): StarterKitDatabase = new StarterKitDatabase {
    override def db = Database.forConfig("slick.dbs.default")
  }
}

trait Database {
  def db: JdbcBackend#DatabaseDef
}

private[modules] trait TestDatabase extends Database

private[modules] trait StarterKitDatabase extends Database
