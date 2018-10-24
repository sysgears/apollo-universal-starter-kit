package core.guice.modules

import com.google.inject.{AbstractModule, Provides}
import com.typesafe.config.Config
import net.codingwell.scalaguice.ScalaModule
import slick.jdbc.JdbcBackend
import slick.driver.SQLiteDriver.api._

class DBModule extends AbstractModule with ScalaModule {

  @Provides
  def database(config: Config): Database = new Database {
    override def db = Database.forConfig("slick.dbs.default")
  }
}

trait Database {
  def db: JdbcBackend#DatabaseDef
}
